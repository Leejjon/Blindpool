import {Component} from "react";
import {withStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import intl from "react-intl-universal";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: '0.5em',
        marginRight: '0.5em',
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    icon: {
        // margin: theme.spacing.unit * 2,
        color: '#00cc47',
        marginRight: 0,
    },
    linktext: {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: '0.13em'
    },
};

class BpMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menuOpen: false,
        }
    }

    render() {
        return (
            <div className={this.props.classes.list}>
                <AppBar color="primary" position="static">
                    <Toolbar className={this.props.classes.toolBar}>
                        <IconButton className={this.props.classes.menuButton} color="inherit"
                                    aria-label="Navigation menu" aria-haspopup="true"
                                    onClick={this.props.closeMenu}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="body1" color="inherit" className={this.props.classes.grow}>
                            Menu
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List>
                    <Link onClick={this.props.closeMenu} to="/create" style={{ textDecoration: 'none' }}>
                        <ListItem button>
                            <ListItemIcon>
                                <Icon className={this.props.classes.icon} fontSize="large">
                                    add_circle
                                </Icon>
                            </ListItemIcon>
                            <ListItemText className={this.props.classes.linktext}>{intl.get("CREATE_POOL")}</ListItemText>
                        </ListItem>
                    </Link>
                    <Link onClick={this.props.closeMenu} to="/whatis" style={{ textDecoration: 'none' }}>
                        <ListItem button>
                            <ListItemIcon>
                                <Icon fontSize="large">
                                    help
                                </Icon>
                            </ListItemIcon>
                            <ListItemText className={this.props.classes.linktext}>{intl.get("WHAT_IS_A_BLINDPOOL")}</ListItemText>
                        </ListItem>
                    </Link>
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(BpMenu);