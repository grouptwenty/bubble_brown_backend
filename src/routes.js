import React from 'react';

const HomeAdmin = React.lazy(() => import('./views/Admin'));
const Order = React.lazy(() => import('./views/Order'));
const Bill = React.lazy(() => import('./views/Bill'));
const Promotion = React.lazy(() => import('./views/Promotion'));
const Table = React.lazy(() => import('./views/Table'));
const Recipe = React.lazy(() => import('./views/Productmanage/Recipe'))
const Stock = React.lazy(() => import('./views/Productmanage/Stock'))
const Customer = React.lazy(() => import('./views/Customer'))
const User = React.lazy(() => import('./views/User'))
// const Laundry = React.lazy(() => import('./views/Laundry'));
// const Repair = React.lazy(() => import('./views/Repair'));
// const News = React.lazy(() => import('./views/News'));
// const Contact = React.lazy(() => import('./views/Contact'));
// const About = React.lazy(() => import('./views/About'));
// const Instruction = React.lazy(() => import('./views/Instruction'));
// const WashingMachine = React.lazy(() => import('./views/WashingMachine'))
// const MachineBrand = React.lazy(() => import('./views/WashingMachinemanage/MachineBrand'))
// const MachineGeneration = React.lazy(() => import('./views/WashingMachinemanage/MachineGeneration'))
// const MachineProgram = React.lazy(() => import('./views/WashingMachinemanage/MachineProgram'))
// const MachineType = React.lazy(() => import('./views/WashingMachinemanage/MachineType'))
// const Setting = React.lazy(() => import('./views/Setting'))
// const Agreement = React.lazy(() => import('./views/Agreement'))
// const Report = React.lazy(() => import('./views/Report'))
// const License = React.lazy(() => import('./views/License'))



const routes = [
    { path: '/admin/', name: 'Admin', component: HomeAdmin },
    { path: '/order/', name: 'order', component: Order },
    { path: '/bill/', name: 'Bill', component: Bill },
    { path: '/promotion/', name: 'Promotion', component: Promotion },
    { path: '/table/', name: 'Table', component: Table },
    { path: '/product-manage/recipe', name: 'Recipe', component: Recipe },
    { path: '/product-manage/stock-in', name: 'Stock', component: Stock },
    { path: '/customer/', name: 'Customer', component: Customer },
    { path: '/user/', name: 'User', component: User },
    // { path: '/laundry/', name: 'Laundry', component: Laundry },
    // { path: '/repair/', name: 'Repair', component: Repair },
    // { path: '/news/', name: 'News', component: News },
    // { path: '/contact/', name: 'Contact', component: Contact },
    // { path: '/about/', name: 'About', component: About },
    // { path: '/instruction/', name: 'Instruction', component: Instruction },
    // { path: '/washing-machine/', name: 'WashingMachine', component: WashingMachine },
    // { path: '/machine-manage/machine-brand/', name: 'MachineBrand', component: MachineBrand },
    // { path: '/machine-manage/machine-generation/', name: 'MachineGeneration', component: MachineGeneration },
    // { path: '/machine-manage/machine-program/', name: 'MachineProgram', component: MachineProgram },
    // { path: '/machine-manage/machine-type/', name: 'MachineType', component: MachineType },
    // { path: '/agreement/', name: 'Agreement', component: Agreement },
    // { path: '/license/', name: 'License', component: License },
    // { path: '/report/', name: 'Report', component: Report },
    // { path: '/setting/', name: 'Setting', component: Setting },
]
export default routes;