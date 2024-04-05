import React, { useState, useEffect, useRef, useContext } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from '../AppTopbar';
import { AppFooter } from '../AppFooter';
import { AppMenu } from '../AppMenu';
import { AppConfig } from '../AppConfig';

import Dashboard from '../components/Dashboard';
import Dashboard2 from '../pages/Dashboard2';
import EmptyPage from './EmptyPage';
import UserManagement from './UserManagement/UserManagement';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';
import '../font.css'
import { IPCCharts } from './IPCCharts';




import MarketSimulation from './MarketSimulation/MarketSimulation8';
import AuthContext from '../store/auth/auth-context';
import MarketSimulationList from './MarketSimulation/MarketSimulationList';
import NetworkSimulationList from './NetworkSimulation/NetworkSimulationList';
import MarketSimulationResults from './MarketSimulation/MarketSimulationResults5';
import EpiasData from './EpiasData/EpiasData_V2';

import NetworkSimulation from './NetworkSimulation/NetworkSimulation4';
import NetworkSimulationResults from './NetworkSimulation/NetworkSimulationResults_V2';
import SCUCResults from './SCUCResults/SCUCResults';
import Publications from './Publications';
const MainPage = () => {

    const authCtx = useContext(AuthContext);

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const location = useLocation();
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const [name_surname,setNameSurname]=useState();
    const copyTooltipRef = useRef();
    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    let [isAdmin,setIsAdmin] = useState(false);
    let [isUser,setIsUser] = useState(false);
    let [isPublication, setIsPublication] = useState(false);
    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();


        const loadData = async()=> {
            setNameSurname(localStorage.getItem('name_surname'));
            const userRole = localStorage.getItem('userRole');

            if(userRole === 'ROLE_USER')
            {
                setIsUser(true);
            }
            else if(userRole === 'ROLE_ADMIN')
            {
                setIsAdmin(true);        
            }
            else if(userRole === 'ROLE_PUBLICATIONS'){
                setIsPublication(true);
            }
        }

        loadData();

    }, [location]);




    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
       
        authCtx.logout();

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setStaticMenuInactive(true);
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }
    const menu = [
        {
            label: 'HOME',isAdmin:isAdmin,isUser:isUser, isPublication:false,
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/Dashboard',isAdmin:isAdmin,isUser:isUser, isPublication:false},
            ]
        },
        {
            label: 'MANAGEMENT', icon: 'pi pi-fw pi-sitemap',isAdmin:isAdmin,isUser:false, isPublication:false, 
            items: [
                { label: 'User Management', icon: 'pi pi-fw pi-users', to: '/userManagement',isAdmin:isAdmin,isUser:isUser, isPublication:false,},
            ],
        },
        {
            label: 'EPİAŞ Transparency Data',isAdmin:isAdmin,isUser:isUser, isPublication:false, 
            items: [
                { label: 'Market Overview', icon: 'pi pi-fw pi-chart-line', to: '/MarketOverview',isAdmin:isAdmin,isUser:true, isPublication:false},
            ]
        },
        {
            label: 'MARKET SIMULATION & MCP ESTIMATION',isAdmin:isAdmin,isUser:isUser, isPublication:false, 
            items: [
                { label: 'Market Simulation & MCP Estimation', icon: 'pi pi-fw pi-chart-line', to: '/MarketSimulation',isAdmin:isAdmin,isUser:true, isPublication:false},
                { label: 'Results', icon: 'pi pi-fw pi-check-circle', to: '/MarketSimulationResults',isAdmin:true,isUser:true, isPublication:false}
                
            ]
        },
        {
            label: 'NETWORK SIMULATION',isAdmin:isAdmin,isUser:false, isPublication:false, 
            items: [
                { label: 'Network Simulation', icon: 'pi pi-fw pi-chart-line', to: '/NetworkSimulation',isAdmin:isAdmin,isUser:false, isPublication:false},
                { label: 'Results', icon: 'pi pi-fw pi-check-circle', to: '/NetworkSimulationResults',isAdmin:true,isUser:false, isPublication:false}
            ]
        },
        {
            label: 'SCUC RESULTS',isAdmin:isAdmin,isUser:false, isPublications:false, 
            items: [
                { label: 'SCUC Results', icon: 'pi pi-fw pi-check-circle', to: '/SCUCResults',isAdmin:isAdmin,isUser:false, isPublication:false}
            ]
        },
        {
            label: 'PUBLICATIONS',isAdmin:isAdmin,isUser:false, isPublication:isPublication, 
            items: [
                { label: 'Publications', icon: 'pi pi-fw pi-check-circle', to: '/Publications',isAdmin:isAdmin,isUser:false, isPublication:isPublication}
            ]
        },
        {
            label: 'IPC Charts',isAdmin:isAdmin,isUser:false, isPublication:isPublication, 
            items: [
                { label: 'IPC Charts', icon: 'pi pi-fw pi-check-circle', to: '/IPC',isAdmin:isAdmin,isUser:false, isPublication:isPublication}
            ]
        },
    ];
    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>


            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
        
            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />            
            <div className="layout-sidebar" onClick={onSidebarClick}>
            <h6 style={{fontSize:"16px", fontWeight:"400"}}>Welcome {name_surname}</h6> 
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode}/>
            </div>
           
            
            <CSSTransition>
            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/" exact render={() => <Dashboard2 />} />
                    <Route path="/UserManagement" exact render={()=> <UserManagement/>} />
                    <Route path="/Dashboard" exact render={()=> <Dashboard2/>} />
                    <Route path="/MarketSimulation" exact render={()=> <MarketSimulation/>} />
                    <Route path="/MarketSimulationResults" exact component={MarketSimulationList} />
                    <Route path="/NetworkSimulationResults" exact component={NetworkSimulationList} />
                    <Route path="/MarketSimulationResults/:id" exact component={MarketSimulationResults} />
                    <Route path="/NetworkSimulationResults/:id" exact component={NetworkSimulationResults} />
                    <Route path="/MarketOverview" exact component={EpiasData} />
                    <Route path="/NetworkSimulation" exact component={NetworkSimulation} />
                    <Route path="/SCUCResults" exact component={SCUCResults} />
                    <Route path="/Publications" exact component={Publications} />
                    <Route path="/IPC" component={IPCCharts} />
                    <Route path="/empty" component={EmptyPage} />
                </div>

                <AppFooter layoutColorMode={layoutColorMode} />
            </div>
            </CSSTransition>
            

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
    );

}

export default MainPage;