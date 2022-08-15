import React, { lazy } from "react";
import { UserOutlined, NodeIndexOutlined  ,WalletOutlined  } from "@ant-design/icons";

const routes = [
    {
        path: "/profile",
        hidden: true,
        title: "Thông tin cá nhân",
        component: lazy(() => import("@/pages/profile")),
    },
    {
        path: "/test",
        hidden: true,
        title: "Thông tin cá nhân",
        component: lazy(() => import("@/pages/testcontrols")),
    },
    {
        title: "Quản trị hệ thống",
        icon: <UserOutlined />,
        path: "",
        childs: [
            {
                title: "Danh mục dịch vụ",
                path: "product",
                component: lazy(() => import("@/pages/product")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/product/create-edit")
                        ),
                        title: "Thêm dịch vụ",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/product/create-edit")
                        ),
                        title: "Cập nhật dịch vụ",
                        hidden: true,
                    },
                ],
            },
            {
                title: "Danh mục dược phẩm bệnh viện",
                path: "drugs",
                component: lazy(() => import("@/pages/drugs")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/drugs/create-edit")
                        ),
                        title: "Thêm thuốc",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/drugs/create-edit")
                        ),
                        title: "Cập nhật thuốc",
                        hidden: true,
                    },
                ],
            },
            {
                title: "Danh mục nhóm dịch vụ",
                path: "category",
                component: lazy(() => import("@/pages/category")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/category/create-edit")
                        ),
                        title: "Thêm danh mục",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/category/create-edit")
                        ),
                        title: "Cập nhật danh mục",
                        hidden: true,
                    },
                ],
            },
            {
                title: "Danh mục đơn vị hành chính",
                path: "administrative",
                component: lazy(() => import("@/pages/administrative")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/administrative/create-edit")
                        ),
                        title: "Thêm đơn vị hành chính",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/administrative/create-edit")
                        ),
                        title: "Cập nhật đơn vị hành chính",
                        hidden: true,
                    },
                ],
            },
           
            {
                title: "Danh mục kho dược",
                path: "warehouse",
                component: lazy(() => import("@/pages/warehouse")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/warehouse/create-edit")
                        ),
                        title: "Thêm kho dược",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/warehouse/create-edit")
                        ),
                        title: "Cập nhật kho dược",
                        hidden: true,
                    },
                ],
            },

            {
                title: "Danh mục nhà cung cấp",
                path: "supplier",
                component: lazy(() => import("@/pages/supplier")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/supplier/create-edit")
                        ),
                        title: "Thêm nhà cung cấp",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/supplier/create-edit")
                        ),
                        title: "Cập nhật nhà cung cấp",
                        hidden: true,
                    },
                ],
            },
            {
                title: "Danh mục phòng ban",
                path: "department",
                component: lazy(() => import("@/pages/department")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/department/create-edit")
                        ),
                        title: "Thêm phòng ban",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/department/create-edit")
                        ),
                        title: "Cập nhật phòng ban",
                        hidden: true,
                    },
                ],
            },


            {
                title: "Danh mục nhân viên",
                path: "employe",
                component: lazy(() => import("@/pages/employe")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/employe/create-edit")
                        ),
                        title: "Thêm nhân viên",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/employe/create-edit")
                        ),
                        title: "Cập nhật nhân viên",
                        hidden: true,
                    },
                ],
            },

            {
                title: "Quản lý tài khoản",
                path: "user",
                component: lazy(() => import("@/pages/user")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/user/create-edit")
                        ),
                        title: "Thêm người dùng mới",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/user/create-edit")
                        ),
                        title: "Cập nhật người dùng",
                        hidden: true,
                    },
                ],
            },
        ],
    },

    {
        title: "Khám bệnh",
        icon: <NodeIndexOutlined />,
        path: "",
        childs: [
            {
                title: "Danh sách bệnh nhân",
                path: "patient",
                component: lazy(() => import("@/pages/patient")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/patient/create-edit")
                        ),
                        title: "Thêm bệnh nhân",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/patient/create-edit")
                        ),
                        title: "Cập nhật bệnh nhân",
                        hidden: true,
                    },
                ],
            },
            {
                title: "Khám bệnh",
                path: "medical_examination/create",
                component: lazy(() =>
                import("@/pages/medical_examination/create-edit")
                ),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/medical_examination/create-edit")
                        ),
                        title: "Thêm dịch vụ",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/medical_examination/create-edit")
                        ),
                        title: "Cập nhật dịch vụ",
                        hidden: true,
                    },
                ],
            },

            {
                title: "Hóa đơn dịch vụ",
                path: "invoices",
                component: lazy(() => import("@/pages/invoices")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/invoices/create-edit")
                        ),
                        title: "Thêm hóa đơn",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/invoices/create-edit")
                        ),
                        title: "Cập nhật dịch vụ",
                        hidden: true,
                    },
                ],
            },
        ],
    },

    {
        title: "Kho dược",
        icon: <WalletOutlined />,
        path: "",
        childs: [
            {
                title: "Danh mục kho thuốc",
                path: "warehouse_drug",
                component: lazy(() => import("@/pages/warehouse_drug")),
                childs: [
                    {
                        path: "create",
                        component: lazy(() =>
                            import("@/pages/warehouse_drug/create-edit")
                        ),
                        title: "Thêm kho thuốc",
                        hidden: true,
                    },
                    {
                        path: "edit/:id",
                        component: lazy(() =>
                            import("@/pages/warehouse_drug/create-edit")
                        ),
                        title: "Cập nhật dịch vụ",
                        hidden: true,
                    },
                ],
            },
        ],
    },
];

export default routes;
