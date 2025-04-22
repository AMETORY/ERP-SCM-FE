import type { FC } from 'react';
import AdminLayout from '../components/layouts/admin';

interface ShipmentPageProps {}

const ShipmentPage: FC<ShipmentPageProps> = ({}) => {
        return (<AdminLayout>
            <h1>Shipment Management</h1>
        </AdminLayout>);
}
export default ShipmentPage;