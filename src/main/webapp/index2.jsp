<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="pds" uri="/tlds/PoolDataStore" %>

<!-- Constant variables -->
<c:set var="internationalDomain" value="https://blindpool.com" scope="page"/>
<c:set var="dutchDomain" value="https://blindepool.nl" scope="page"/>
<c:set var="defaultNumberOfPlayers" value="5" scope="page"/>

<%-- If the language is Dutch, show dutch! --%>
<c:choose>
    <c:when test="${fn:endsWith(pageContext.request.serverName, 'blindepoule.nu')}">
        <c:set var="language" value="nl" scope="session"/>
    </c:when>
    <c:when test="${fn:endsWith(pageContext.request.serverName, 'blindepool.nl')}">
        <c:set var="language" value="nl" scope="session"/>
    </c:when>
    <c:otherwise>
        <c:set var="language" value="en" scope="session"/>
    </c:otherwise>
</c:choose>

<%-- Use the locale to set up the bundle. --%>
<fmt:setLocale value="${language}"/>
<fmt:setBundle basename="net.leejjon.blindpool.i18n.messages"/>

<html>
<head>
    <title>Title</title>

    <!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="css/materialize.css"  media="screen,projection"/>
    <link rel="stylesheet" type="text/css" href="css/layout2.css">

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
    <!-- Language dropdown list -->
    <nav class="green accent-5">
        <div class="nav-wrapper">
            <%--<a href="#" class="brand-logo">Logo</a>--%>
            <ul class="right">
                <li><a href="sass.html"><b>About</b></a></li>
                <li><a class="dropdown-trigger" href="#!" data-target="dropdown1"><b>Language</b><i class="material-icons right">arrow_drop_down</i></a>
                <ul id="dropdown1" class="dropdown-content">
                    <li><a href="#!">English</a></li>
                    <li class="divider"></li>
                    <li><a href="#!">Nederlands</a></li>
                </ul>
                </li>

            </ul>
        </div>
    </nav>

    <div align="center" class="container">
        <img id="logoImage" src="images/logo.png"/>

        <div class="divider"></div>

        <table>
            <tr>
                <th>&nbsp;&nbsp;&nbsp;<fmt:message key="entry.name"/></th>
            </tr>
            <tr>
                <td>
                    <div class="input-field" style="white-space:nowrap;">
                        <b>1</b>&nbsp;&nbsp;<input placeholder="Enter" id="participantName1" type="text" class="validate">
                    </div>
                </td>
                <td>
                    &nbsp;<i class="material-icons">person</i>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="input-field" style="white-space:nowrap;">
                        2&nbsp;&nbsp;<input placeholder="Enter" id="participantName2" type="text" class="validate">
                    </div>
                </td>
                <td>
                    &nbsp;<i class="material-icons">remove_circle_outline</i>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="input-field" style="white-space:nowrap;">
                        3&nbsp;&nbsp;<input placeholder="Enter" id="participantName3" type="text" class="validate">
                    </div>
                </td>
                <td>
                    &nbsp;<i class="material-icons">remove_circle_outline</i>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="input-field" style="white-space:nowrap;">
                        4&nbsp;&nbsp;<input placeholder="Enter" id="participantName4" type="text" class="validate">
                    </div>
                </td>
                <td>
                    &nbsp;<a class="waves-effect waves-teal btn-floating btn-small blue-grey lighten-3"><i class="material-icons">remove</i></a>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="input-field" style="white-space:nowrap;">
                        5&nbsp;&nbsp;<input placeholder="Enter" id="participantName5" type="text" class="validate">
                    </div>
                </td>
                <td>
                    &nbsp;<a class="btn-floating btn-small waves-effect waves-light black"><i class="material-icons" style="color: white;">remove</i></a>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="left"><br />
                    &nbsp;&nbsp;&nbsp<a class="btn-floating btn-small waves-effect waves-light black"><i class="material-icons" style="color: white;">add</i></a><i class="material-icons">add_circle_outline</i>
                </td>
            </tr>
        </table>
    </div>
    <script type="text/javascript" src="js/materialize.js"></script>
</body>
</html>
