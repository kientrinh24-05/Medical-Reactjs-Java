import ContentRight from './right-content';
import { Layout } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const { Header } = Layout;
import { useContext } from 'react';
import AppContext from '@/context/app';

const HeaderMain = () => {
    const appContext = useContext(AppContext);
    return (
        <Header className="bg-slate-700 px-3 flex items-center py-5 sticky top-0 z-50 shadow-lg ">
            <FontAwesomeIcon size="2x"
                onClick={() => appContext.toggleMenu()}
                className="cursor-pointer text-white" icon={appContext.collapsed ? "fa-solid fa-arrow-right" : "fa-solid fa-bars-staggered"} />
    
            <div className="ml-auto flex items-center">
                <ContentRight />
            </div>
        </Header>
    )
}
export default HeaderMain;