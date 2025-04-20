import { Tabs } from "flowbite-react";
import { useState, type FC } from "react";
import { BsListCheck } from "react-icons/bs";
import { IoPricetagOutline } from "react-icons/io5";
import { RiShoppingBagLine } from "react-icons/ri";
import AdminLayout from "../components/layouts/admin";
import ProductTable from "../components/ProductTable";
import ModalProduct from "../components/ModalProduct";
import { ProductModel } from "../models/product";
import ProductCategoryTable from "../components/ProductCategoryTable";

import { PiDotsNine } from "react-icons/pi";
import ProductAttributeTable from "../components/ProductAttributeTable";
import { TbRulerMeasure } from "react-icons/tb";
import UnitTable from "../components/UnitTable";

interface ProductPageProps {}

const ProductPage: FC<ProductPageProps> = ({}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState<ProductModel>();

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-4 px-8">
        <Tabs
          aria-label="Default tabs"
          variant="default"
          onActiveTabChange={(tab) => {
            setActiveTab(tab);
            // console.log(tab);
          }}
          className="mt-4"
        >
          <Tabs.Item
            active={activeTab === 0}
            title="Goods"
            icon={RiShoppingBagLine}
          >
            <ProductTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title="Category"
            icon={BsListCheck}
          >
            <ProductCategoryTable />
          </Tabs.Item>
         
          
          <Tabs.Item active={activeTab === 2} title="Units" icon={TbRulerMeasure}>
            <UnitTable />
          </Tabs.Item>
        </Tabs>
      </div>

    </AdminLayout>
  );
};
export default ProductPage;
