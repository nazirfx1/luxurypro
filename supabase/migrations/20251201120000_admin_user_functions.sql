-- ============================================
-- ADMIN USER CREATION FUNCTIONS
-- ============================================

-- Create a function to create admin users
-- This function will be used by the setup page to create the first admin
CREATE OR REPLACE FUNCTION public.create_admin_user(
    admin_email text,
    admin_password text,
    admin_name text,
    admin_role text DEFAULT 'admin',
    admin_secret text DEFAULT 'create-admin-user-secret-2024'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_user_id uuid;
    auth_user_data jsonb;
    expected_secret text := 'create-admin-user-secret-2024';
BEGIN
    -- Verify admin secret for security
    IF admin_secret != expected_secret THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Unauthorized: Invalid admin secret'
        );
    END IF;

    -- Validate inputs
    IF admin_email IS NULL OR admin_password IS NULL OR admin_name IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Missing required fields: email, password, or name'
        );
    END IF;

    -- Validate role
    IF admin_role NOT IN ('super_admin', 'admin', 'manager', 'sales_agent', 'property_owner', 'tenant', 'support_staff', 'accountant') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid role specified'
        );
    END IF;

    BEGIN
        -- Create user in auth.users table using raw insert
        -- This bypasses normal auth flow for admin creation
        new_user_id := gen_random_uuid();
        
        -- Insert into auth.users (simplified approach)
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            invited_at,
            confirmation_token,
            confirmation_sent_at,
            recovery_token,
            recovery_sent_at,
            email_change_token_new,
            email_change,
            email_change_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            created_at,
            updated_at,
            phone,
            phone_confirmed_at,
            phone_change,
            phone_change_token,
            phone_change_sent_at,
            email_change_token_current,
            email_change_confirm_status,
            banned_until,
            reauthentication_token,
            reauthentication_sent_at,
            is_sso_user,
            deleted_at
        ) VALUES (
            new_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            NOW(),
            NOW(),
            '',
            NOW(),
            '',
            NULL,
            '',
            '',
            NULL,
            NULL,
            '{"provider": "email", "providers": ["email"]}',
            jsonb_build_object('full_name', admin_name),
            false,
            NOW(),
            NOW(),
            NULL,
            NULL,
            '',
            '',
            NULL,
            '',
            0,
            NULL,
            '',
            NULL,
            false,
            NULL
        );

        -- Insert into profiles table
        INSERT INTO public.profiles (
            id,
            full_name,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            admin_name,
            NOW(),
            NOW()
        );

        -- Insert role assignment
        INSERT INTO public.user_roles (
            user_id,
            role,
            assigned_at,
            assigned_by
        ) VALUES (
            new_user_id,
            admin_role,
            NOW(),
            new_user_id  -- Self-assigned for initial admin
        );

        -- Return success
        RETURN jsonb_build_object(
            'success', true,
            'user_id', new_user_id,
            'email', admin_email,
            'role', admin_role,
            'message', 'Admin user created successfully'
        );

    EXCEPTION WHEN OTHERS THEN
        -- Return error details
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
    END;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user TO anon;

-- Create a simpler function for basic admin creation (used by setup page)
CREATE OR REPLACE FUNCTION public.setup_initial_admin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if any admin already exists
    IF EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE role IN ('super_admin', 'admin')
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Admin user already exists. Use the regular signup process.'
        );
    END IF;

    -- Create the default admin user
    RETURN public.create_admin_user(
        'nazirfxone@gmail.com',
        'hacksom-1212',
        'Nazir Ismail',
        'super_admin',
        'create-admin-user-secret-2024'
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.setup_initial_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.setup_initial_admin TO anon;

-- Create a function to check if setup is needed
CREATE OR REPLACE FUNCTION public.needs_admin_setup()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Return true if no admin users exist
    RETURN NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE role IN ('super_admin', 'admin')
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.needs_admin_setup TO authenticated;
GRANT EXECUTE ON FUNCTION public.needs_admin_setup TO anon;

-- Create RPC endpoints that can be called from the frontend
-- These provide a secure interface to the admin creation functions

-- RPC for creating admin user with parameters
CREATE OR REPLACE FUNCTION public.rpc_create_admin_user(
    email text,
    password text,
    full_name text,
    role text DEFAULT 'admin',
    secret text DEFAULT 'create-admin-user-secret-2024'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN public.create_admin_user(email, password, full_name, role, secret);
END;
$$;

-- RPC for initial admin setup
CREATE OR REPLACE FUNCTION public.rpc_setup_initial_admin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN public.setup_initial_admin();
END;
$$;

-- RPC for checking if setup is needed
CREATE OR REPLACE FUNCTION public.rpc_needs_admin_setup()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN public.needs_admin_setup();
END;
$$;

-- Grant execute permissions to all RPC functions
GRANT EXECUTE ON FUNCTION public.rpc_create_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_create_admin_user TO anon;
GRANT EXECUTE ON FUNCTION public.rpc_setup_initial_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_setup_initial_admin TO anon;
GRANT EXECUTE ON FUNCTION public.rpc_needs_admin_setup TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_needs_admin_setup TO anon;

-- Add comments for documentation
COMMENT ON FUNCTION public.create_admin_user IS 'Creates a new admin user with specified role and credentials';
COMMENT ON FUNCTION public.setup_initial_admin IS 'Creates the initial super admin user if none exists';
COMMENT ON FUNCTION public.needs_admin_setup IS 'Checks if the system needs initial admin setup';
COMMENT ON FUNCTION public.rpc_create_admin_user IS 'RPC endpoint for creating admin users from frontend';
COMMENT ON FUNCTION public.rpc_setup_initial_admin IS 'RPC endpoint for initial admin setup from frontend';
COMMENT ON FUNCTION public.rpc_needs_admin_setup IS 'RPC endpoint for checking if admin setup is needed';