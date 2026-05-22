import { Authenticated } from 'features/auth';
import { ProfileProvider, ProjectVerification } from 'providers/user-profile';
import { Outlet } from 'react-router-dom';
import AppShell from './app-shell';

export const ProtectedLayout = () => {
  return (
    <Authenticated>
      <ProfileProvider>
        <AppShell />
      </ProfileProvider>
    </Authenticated>
  );
};

export const ProjectLayout = () => {
  return (
    <ProjectVerification>
      <Outlet />
    </ProjectVerification>
  );
};
