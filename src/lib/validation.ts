/**
 * Request validation utilities using Zod
 * Provides type-safe validation for API routes
 */

import { z } from 'astro/zod';

/**
 * Validation schemas
 */

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Query is required').max(200, 'Query too long'),
  type: z.enum(['letter', 'speech', 'lecture', 'essay', 'all']).optional().default('all'),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

export const contentTypeSchema = z.enum(['letter', 'speech', 'lecture', 'essay']);

export const filterSchema = z.object({
  type: z.enum(['letter', 'speech', 'lecture', 'essay', 'all']).optional(),
  author: z.string().max(100).optional(),
  year: z.coerce.number().min(1000).max(3000).optional(),
  tag: z.string().max(50).optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(['date', 'title', 'author']).optional().default('date'),
  order: z.enum(['asc', 'desc']).optional().default('desc')
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; details?: string[] } };

/**
 * Validate query parameters
 */
export function validateQuery<T>(
  schema: z.ZodSchema<T>,
  params: URLSearchParams | Record<string, any>
): ValidationResult<T> {
  try {
    // Convert URLSearchParams to object if needed
    const data = params instanceof URLSearchParams
      ? Object.fromEntries(params.entries())
      : params;

    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'Validation failed',
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }
      };
    }

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown validation error'
      }
    };
  }
}

/**
 * Validate request body (for future POST/PUT endpoints)
 */
export async function validateBody<T>(
  schema: z.ZodSchema<T>,
  request: Request
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    const result = schema.parse(body);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'Invalid request body',
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }
      };
    }

    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: { message: 'Invalid JSON in request body' }
      };
    }

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown validation error'
      }
    };
  }
}

/**
 * Create error response for validation failures
 */
export function validationErrorResponse(
  error: ValidationResult<any>['error']
): Response {
  return new Response(
    JSON.stringify({
      error: error.message,
      details: error.details || []
    }),
    {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Sanitize string inputs to prevent XSS
 * Comprehensive protection against common XSS vectors
 */
export function sanitizeString(str: string): string {
  // First, normalize unicode and remove null bytes
  let sanitized = str
    .normalize('NFKC')
    .replace(/\0/g, '');

  // HTML encode dangerous characters
  const htmlEncodeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  sanitized = sanitized.replace(/[&<>"'`=/]/g, (char) => htmlEncodeMap[char] || char);

  // Remove dangerous protocols (case-insensitive, handles obfuscation)
  const dangerousProtocols = [
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /file:/gi,
    /about:/gi
  ];

  dangerousProtocols.forEach(protocol => {
    sanitized = sanitized.replace(protocol, '');
  });

  // Remove event handlers (on*, case-insensitive)
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // Remove potential script tags and their variations
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gis, '');
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gis, '');
  sanitized = sanitized.replace(/<object[^>]*>.*?<\/object>/gis, '');
  sanitized = sanitized.replace(/<embed[^>]*>/gis, '');

  // Remove CSS expressions
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  sanitized = sanitized.replace(/import\s+/gi, '');

  // Remove HTML comments that could hide malicious code
  sanitized = sanitized.replace(/<!--.*?-->/gs, '');

  return sanitized.trim();
}

/**
 * Validate and sanitize search query
 */
export function validateSearchQuery(query: string): string {
  const sanitized = sanitizeString(query);

  if (sanitized.length === 0) {
    throw new Error('Query cannot be empty');
  }

  if (sanitized.length > 200) {
    throw new Error('Query too long (max 200 characters)');
  }

  return sanitized;
}

/**
 * Type exports for use in API routes
 */
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type FilterParams = z.infer<typeof filterSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type ContentType = z.infer<typeof contentTypeSchema>;
