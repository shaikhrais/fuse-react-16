import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@fuse/core/Link';
import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';
import { Alert } from '@mui/material';
import signinErrors from './signinErrors';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.'),
	remember: z.boolean().optional()
});

type FormType = z.infer<typeof schema>;

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function AuthJsCredentialsSignInForm() {
	const { control, formState, handleSubmit, setValue, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		// Pre-fill with demo values for testing - you can remove this
		setValue('email', 'test@example.com', {
			shouldDirty: true,
			shouldValidate: true
		});
		setValue('password', 'password123', {
			shouldDirty: true,
			shouldValidate: true
		});
		
		console.log('🔐 AuthJsCredentialsSignInForm - Pre-filled with demo credentials');
	}, [setValue]);

	async function onSubmit(formData: FormType) {
		const { email, password } = formData;

		console.log('🔐 AuthJsCredentialsSignInForm - Starting authentication with:', { 
			email, 
			passwordLength: password?.length || 0 
		});
		
		// Show popup notification
		alert(`🔄 AuthJsCredentialsSignInForm - Attempting login with email: ${email}`);

		try {
			const result = await signIn('credentials', {
				email,
				password,
				formType: 'signin',
				redirect: false
			});

			console.log('🔐 AuthJsCredentialsSignInForm - Authentication result:', result);

			if (result?.error) {
				console.error('❌ AuthJsCredentialsSignInForm - Authentication failed:', result.error);
				alert(`❌ AuthJsCredentialsSignInForm - Login failed: ${signinErrors[result.error] || result.error}`);
				setError('root', { type: 'manual', message: signinErrors[result.error] });
				return false;
			}

			if (result?.ok) {
				console.log('✅ AuthJsCredentialsSignInForm - Authentication successful!');
				alert('✅ AuthJsCredentialsSignInForm - Login successful!');
				return true;
			}

			console.warn('⚠️ AuthJsCredentialsSignInForm - Unexpected result:', result);
			alert('⚠️ AuthJsCredentialsSignInForm - Unexpected authentication result');
			return false;
			
		} catch (error) {
			console.error('💥 AuthJsCredentialsSignInForm - Exception during authentication:', error);
			alert(`💥 AuthJsCredentialsSignInForm - Authentication error: ${error.message}`);
			return false;
		}
	}

	return (
		<form
			name="loginForm"
			noValidate
			className="flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			{errors?.root?.message && (
				<Alert
					className="mb-8"
					severity="error"
					sx={(theme) => ({
						backgroundColor: theme.palette.error.light,
						color: theme.palette.error.dark
					})}
				>
					{errors?.root?.message}
				</Alert>
			)}
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Email"
						autoFocus
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Password"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>
			<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>

				<Link
					className="text-md font-medium"
					to="/#"
				>
					Forgot password?
				</Link>
			</div>
			<Button
				variant="contained"
				color="secondary"
				className="mt-4 w-full"
				aria-label="Sign in"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Sign in
			</Button>
		</form>
	);
}

export default AuthJsCredentialsSignInForm;
