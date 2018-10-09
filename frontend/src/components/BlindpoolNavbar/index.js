import React, {Component} from 'react';
import {Navbar, NavItem} from 'react-materialize'

class BlindPoolNavbar extends Component {
    render() {
        return (
            <Navbar className='green accent-4'>
                <NavItem>Haha</NavItem>
                <ul className="right">
                    <li><NavItem>Hoi</NavItem></li>
                </ul>
            </Navbar>
        );
    }
}

export default BlindPoolNavbar;
