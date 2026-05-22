import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DeviceTree } from 'features/device/deviceTree';
import { Provider } from 'features/device/provider';
import { useVirtualRootDevice } from 'features/device/virtual';
import { PageWithSideBar } from 'features/layout';

export default function Layout() {
  const rootDevice = useVirtualRootDevice();
  const { id: pathId = `${rootDevice.id}` } = useParams();

  return (
    <Provider>
      <PageWithSideBar
        content={<Outlet />}
        sideBar={{
          body: ({ height, close }) => (
            <DeviceTree height={Math.floor(height)} onClick={close} selectedKeys={[pathId]} />
          )
        }}
      />
    </Provider>
  );
}
