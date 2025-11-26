import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="flex">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}