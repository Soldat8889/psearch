import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

// Chat
import socketIoClient from 'socket.io-client';

// Contexts
import { UserContext } from '../common/contexts/UserContext';
import { ConfigContext } from '../common/contexts/ConfigContext';

class Dashboard extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        /**
         * @param { Object } this.state.socket Socket IO Client Side
         * @param { Boolean } this.state.chatIsExpand Define if the Chat is expanded (fullscreen)
         * @param { String } this.state.redirect Redirect if the User leaves Chat to a specific URL
         */

        this.state = {
            socket: socketIoClient(`http://localhost:8000`),
            chatIsExpand: false,
            chatStatus: true,
            chatRealStatus: false,

            redirect: ""
        }

        this.expandingChatStateHandler = this.expandingChatStateHandler.bind(this);
        this.keyHandler                = this.keyHandler.bind(this);
        this.hashHandler               = this.hashHandler.bind(this);
        this.socketHandler             = this.socketHandler.bind(this);
    }

    /**
     * Expand or Minify the Chat Component
     * 
     * @param { Object } e Optionnal param, it seems Event Object; you can put /null/
     * @param { String } type Sets arbitrarily in methods
     */

    expandingChatStateHandler(e, type) {
        try {
            const t = e.currentTarget.getAttribute('data-action');

            if(t !== undefined) {
                if(t === 'expand') {
                    this.setState({
                        chatIsExpand: true,
                        redirect: `/dashboard/chat/@channels#fullscreen`
                    });
                } else {
                    this.setState({
                        chatIsExpand: false,
                        redirect: "/dashboard"
                    });
                }
            } else {
                if(type === 'expand') {
                    this.setState({
                        chatIsExpand: true,
                        redirect: `/dashboard/chat/@channels#fullscreen`
                    });
                } else {
                    this.setState({
                        chatIsExpand: false,
                        redirect: "/dashboard"
                    });
                }
            }
        } catch (e) {}
    }

    /**
     * Handle what action the key will can do
     * 
     * @param { Object } e Event Object
     * @param { Number } keyCode The codification of the current key pressed
     * @returns { Void } Nothing to do, if a key is targeted, redirect to its method
     */

    keyHandler(e, keyCode) {
        /*
            27 => Esc. key
        */

        switch(keyCode) {
            case 27: 
                this.state.chatIsExpand ? this.setState({chatIsExpand: false, redirect: "/dashboard"}) : null;
                break;
            default:
                break;
        }
    }

    /**
     * Hash Changing Handler
     */

    hashHandler() {
        location.hash == "#fullscreen" ? this.setState({chatIsExpand: true}) : this.setState({chatIsExpand: false});
    }

    socketHandler() {
        let { socket, chatRealStatus } = this.state;
        const chatSupportTimer = setTimeout(() => {
            this.setState({
                chatStatus: false
            });
        }, 5000);

        if(window.CONF.env === "production") {
            this.setState({
                socket: socketIoClient(`https://psearch.alwaysdata.net`)
            });
        }

        if(this._isMounted) {
            // Socket Status
            socket.on("status", chatStatus => { 
                this.setState({ chatStatus, chatRealStatus: chatStatus });
                clearTimeout(chatSupportTimer);
            });
        }
    }

    componentDidMount() {
        this._isMounted = true;

        this.socketHandler();

        window.addEventListener('keyup', e => {
            this.keyHandler(e, e.keyCode);
        }, false);

        window.addEventListener('hashchange', () => {
            this.hashHandler();
        }, false);

        this.hashHandler()
    }

    componentWillUnmount() {
        this._isMounted = false;
        let { socket } = this.state;

        window.removeEventListener('keyup', e => {
            this.keyHandler(e, e.keyCode);
        }, false);

        window.removeEventListener('hashchange', () => {
            this.hashHandler();
        }, false);

        // Aborting Socket
        socket.off("status");
    }
    
    render() {
        const { chatIsExpand, chatStatus, redirect } = this.state;

        if(redirect !== "") {
            return <Redirect to={redirect} />
        }

        return (
            <section className="page-content">
                <div id="packed" className="packed"></div>
                <Sidebar />
                <Chat 
                    status={chatStatus}
                    expand={true}
                    hidden={!chatIsExpand}
                    handler={this.expandingChatStateHandler}
                    addClass="chat--fullscreen inline-vh"
                />
                <div className="dashboard-main">
                    <Header />
                    <Body 
                        chatIsExpand={chatIsExpand}
                        chatStatus={chatStatus}
                        handler={this.expandingChatStateHandler}
                    />
                </div>
            </section>
        )
    }
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <UserContext.Consumer>
                {user => (
                    <aside className="dashboard-sidebar">
                        <div className="dashboard-sidebar__heading"></div>
                        <div className="dashboard-sidebar__menu"></div>
                        <div className="dashboard-sidebar__container">
                            <img className="dashboard-sidebar__avatar" src={`/assets${user.Avatar_User}`} />
                            <h1>{user.Username_User}</h1>
                        </div>
                    </aside>
                )}
            </UserContext.Consumer>
        );
    }
}

// Components
import TopBar from './../common/layouts/Header/TopBar';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <UserContext.Consumer>
                {user => (
                    <header id="Dashboard_Header" className="dashboard-header page-part-wrapper">
                        <div className="background-overlay overlay--horizon-zero-dawn" style={{backgroundImage: 'url(https://cdna.artstation.com/p/assets/images/images/011/428/098/large/graham-tattersall-flat-background-mountains.jpg?1529525121)'}}></div>
                        <div className="page-part-content">
                            <TopBar 
                                params={
                                    {
                                        isSticky: false
                                    }
                                }
                                isAuthed={user ? true : false}
                            />
                            <div className="dashboard-header__review-container">
                                <div className="dashboard-header_review-content container">
                                    <h1>Welcome to your profile !</h1>
                                    <h2>{JSON.stringify(user)}</h2>
                                </div>
                            </div>
                        </div>
                    </header>
                )}
            </UserContext.Consumer>
        );
    }
}

// Components
import Chat from './../common/layouts/Body/Chat';

class Body extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { chatIsExpand, chatStatus, handler } = this.props;

        return (
            <UserContext.Consumer>
                {user => (
                    <section id="Dashboard_Body" className="dashboard-body page-part-wrapper container">
                        <div className="page-part-content">
                            <div className="dashboard-body__line">
                                <CurrentPlaying 
                                    user={user} 
                                />
                                <Chat 
                                    status={chatStatus}
                                    expand={false} 
                                    handler={handler}
                                    addClass={chatIsExpand ? "__state--collapse" : "__state--expand"}
                                />
                            </div>
                            <div className="dashboard-body__line">
                                <div className="dashboard-body__box--wrapper col-m-3">
                                    <div className="dashboard-body__box"></div>
                                </div>
                                <div className="dashboard-body__box--wrapper col-m-3">
                                    <div className="dashboard-body__box"></div>
                                </div>
                                <div className="col-m-6">
                                    <div className="dashboard-body__box--vertical">
                                        <div className="dashboard-body__box"></div>
                                    </div>
                                    <div className="dashboard-body__box--vertical">
                                        <div className="dashboard-body__box"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </UserContext.Consumer>
        );
    }
}

class CurrentPlaying extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dashboard-body__box--wrapper col-m-4">
                <div className="dashboard-body__box background--cover-all webp-test lazy-loading" data-background data-lazy-loading="/assets/images/league-of-legends--summoners-rift .jpg">
                </div>
            </div>
        );
    }
}

export default withRouter(Dashboard);