<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="pds" uri="/tlds/PoolDataStore" %>

<%-- Use the locale to set up the bundle. --%>
<fmt:setLocale value="${language}"/>
<fmt:setBundle basename="net.leejjon.blindpool.i18n.messages"/>

<html>
<head>
    <title>Title</title>

    <!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/layout2.css">
    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="css/materialize.css"  media="screen,projection"/>

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
    <nav class="green accent-5"><!-- class="green" -->
        <div class="nav-wrapper">
            <%--<a href="#" class="brand-logo">Logo</a>--%>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><a href="sass.html">About</a></li>
                <li>
                    <%--<label><fmt:message key="language"/></label>--%>
                    <a onclick="alert('Build language thing')">Language</a>
                </li>
            </ul>
        </div>
    </nav>
    <div align="center" class="container">
        <img id="logoImage" src="images/logo.png"/>
        <p>HoiHoi</p>
    </div>
    <script type="text/javascript" src="js/materialize.js"></script>
</body>
</html>
