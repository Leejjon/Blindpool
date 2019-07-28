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
        marginRight: '0.3em',
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
        marginTop: '0.13em',
    },
    logoImage: {
        width: "150px",
        height: "24px",
        marginTop: "0.4em",
    },
    linkWithoutDecoration: {
        textDecoration: 'none'
    },
    negativeLinkPadding: {
        //display: 'none'
        paddingRight: '0px',
        marginRight: '-0.5em'
    }
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
                <AppBar color="primary" position="static" onClick={this.props.closeMenu}>
                    <Toolbar className={this.props.classes.toolBar}>
                        <IconButton className={this.props.classes.menuButton} color="inherit"
                                    aria-label="Navigation menu" aria-haspopup="true">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="body1" color="inherit" className={this.props.classes.grow}>
                            <img alt="BLINDPOOL" className={this.props.classes.logoImage}
                                 src={require("../../images/logo2.png")}/>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List component="ul">
                    <ListItem button component={Link} onClick={this.props.closeMenu} to="/create"
                              className={this.props.classes.linkWithoutDecoration}>
                        <ListItemIcon className={this.props.classes.negativeLinkPadding}>
                            <Icon className={this.props.classes.icon} fontSize="large">
                                add_circle
                            </Icon>
                        </ListItemIcon>
                        <ListItemText className={this.props.classes.linktext}>
                            {intl.get("CREATE_POOL")}
                        </ListItemText>
                    </ListItem>
                    <ListItem button component={Link} onClick={this.props.closeMenu} to="/howto"
                              className={this.props.classes.linkWithoutDecoration}>
                        <ListItemIcon className={this.props.classes.negativeLinkPadding}>
                            <Icon fontSize="large">
                                help
                            </Icon>
                        </ListItemIcon>
                        <ListItemText className={this.props.classes.linktext}>
                            {intl.get("HOW_TO_USE_BLINDPOOL")}
                        </ListItemText>
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(BpMenu);