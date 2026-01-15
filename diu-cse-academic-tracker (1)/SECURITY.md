# Security Policy

## Overview
This document outlines the security measures implemented in the DIU CSE Academic Tracker application.

## Environment Variables

### Critical Security Rules
1. **NEVER** commit `.env.local` or any file containing real API keys to version control
2. Always use the `.env.example` template when setting up a new environment
3. Keep your Supabase credentials secure and private

### Environment Files
- `.env.example` - Template file (safe to commit)
- `.env.local` - Your actual credentials (NEVER commit)

## Supabase Security

### API Keys
- **Anon Key**: Safe to use in client-side code. This key is designed for public use.
- **Service Role Key**: NEVER expose this in client-side code. It bypasses all security policies.

### Row Level Security (RLS)
All database tables MUST have Row Level Security enabled. Required policies:

#### `profiles` Table
```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

#### `academic_records` Table
```sql
-- Users can read records for their section
CREATE POLICY "Users can view section records"
ON academic_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.section = academic_records.section
  )
);

-- Only approved CRs can insert records
CREATE POLICY "Approved CRs can insert records"
ON academic_records FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can delete records
CREATE POLICY "Approved CRs can delete records"
ON academic_records FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);
```

#### `courses` Table
```sql
-- Everyone can read courses
CREATE POLICY "Public read access"
ON courses FOR SELECT
USING (true);

-- Only approved CRs can insert courses
CREATE POLICY "Approved CRs can insert courses"
ON courses FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);
```

#### `course_groups` & `group_members` Tables
```sql
-- Users can read groups for their section
CREATE POLICY "Users can view section groups"
ON course_groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.section = course_groups.section
  )
);

-- Only approved CRs can manage groups
CREATE POLICY "Approved CRs can manage groups"
ON course_groups FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);
```

## Authentication Security

### Email Validation
- Only `@diu.edu.bd` emails are allowed for registration
- Implemented in `supabaseService.ts`

### Password Security
- Passwords are hashed by Supabase Auth
- Minimum password requirements enforced by Supabase
- Password reset flow uses secure email tokens

### Session Management
- Sessions persist across page reloads
- Automatic token refresh enabled
- Secure session detection in URL

## Input Validation

### Client-Side Validation
1. Email format validation
2. Required field validation
3. Student ID format validation
4. Section and group validation

### Server-Side Protection
- Supabase RLS policies prevent unauthorized access
- Database constraints enforce data integrity

## Content Security Policy (CSP)

Security headers are implemented in `index.html`:
- Restricts resource loading to trusted sources
- Prevents XSS attacks
- Controls script execution

## Best Practices

### For Developers
1. Never commit sensitive credentials
2. Use `.env.example` as a template
3. Keep dependencies updated
4. Review code for security vulnerabilities
5. Test RLS policies thoroughly

### For Deployment
1. Use environment variables for all secrets
2. Enable HTTPS in production
3. Configure proper CORS settings
4. Monitor Supabase logs for suspicious activity
5. Regularly review and update RLS policies

## Reporting Security Issues

If you discover a security vulnerability, please report it immediately to the project maintainers. Do not create public GitHub issues for security vulnerabilities.

## Security Checklist

- [x] Environment variables properly configured
- [x] `.gitignore` includes all sensitive files
- [x] `.env.example` template created
- [x] Email validation implemented
- [x] Session management configured
- [ ] Row Level Security policies applied in Supabase
- [ ] Content Security Policy headers added
- [ ] Regular security audits scheduled

## Additional Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
