import { Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const { login } = useAuth();
  return <Button onClick={login}>Login</Button>;
}
