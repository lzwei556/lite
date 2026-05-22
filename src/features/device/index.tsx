import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { PageWithSideBar } from '../../components';
import { DeviceTree } from './deviceTree';
import { useVirtualRootDevice } from './virtual';
import { Provider } from './provider';

const DevicePage = () => {
  const rootDevice = useVirtualRootDevice();
  const { id: pathId = `${rootDevice.id}` } = useParams();

  return (
    <Provider>
      <PageWithSideBar
        content={<Outlet />}
        sideBar={{
          body: (height, onClick) => (
            <DeviceTree height={height} onClick={onClick} selectedKeys={[pathId]} />
          )
        }}
      />
    </Provider>
  );
};

export default DevicePage;


