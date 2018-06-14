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

<!DOCTYPE html>
<html lang="${language}">
<head>
    <title><fmt:message key="title"/></title>

    <!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Archivo" rel="stylesheet">

    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="css/materialize.css"  media="screen,projection"/>
    <link rel="stylesheet" type="text/css" href="css/blindpool.css">

    <link rel="icon" type="image/png" href="favicon.png">

    <script src="js/blindpool.js"></script>

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body onload="loadPage()">
    <!-- Language dropdown list -->
    <nav class="green accent-5">
        <div class="nav-wrapper">
            <a href="#!" class="navbar-item">&nbsp;<b><fmt:message key="what.is.a.blindpool"/></b></a>
            <ul class="right">
                <li>
                    <a class="navbar-item hide-on-med-and-down" href="#!"><b><fmt:message key="about.page"/></b></a>
                </li>
                <!-- Dropdown Trigger -->
                <li>
                    <a class="dropdown-trigger navbar-item" href="#!" data-target="dropdown"><b><fmt:message
                            key="language"/></b>
                        <i id="languageDropdown" class="material-icons right">arrow_drop_down</i>
                    </a>
                    <ul id="dropdown" class="dropdown-content" tabindex="0" style="">
                        <li tabindex="0">
                            <a href="https://blindpool.com">English</a>
                        </li>
                        <li class="divider" tabindex="0"></li>
                        <li tabindex="0">
                            <a href="https://blindepool.nl">Nederlands</a>
                        </li>
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
                <th></th>
                <th><fmt:message key="entry.name"/></th>
                <th></th>
                <th></th>
            </tr>
            <tr id="participant1">
                <td id="numberColumn1" class="numberColumn"><b>1</b></td>
                <td>
                    <div class="input-field">
                        <fmt:message key="host" var="hostPlaceHolder" />
                        <input maxlength="16" required="required" placeholder="${hostPlaceHolder}" id="participantName1" class="validate" type="text" onblur="hideError(1)">
                        <span id="nameValidation1" class="helper-text nameValidation" data-error="Enter a valid name."  data-success="Correct, but this shouldn't be visible."></span>
                    </div>
                </td>
                <td>
                    <i class="material-icons">person</i>
                </td>
                <td><input id="scoreField1" class="scoreColumn" autocomplete="off" type="text" value="" readonly="readonly"></td>
            </tr>
            <fmt:message key="player.name.placeholder" var="playerPlaceHolder" />
            <tr id="participant2">
                <td id="numberColumn2" class="numberColumn">2</td>
                <td>
                    <div class="input-field">
                        <input maxlength="16" required="required" placeholder="${playerPlaceHolder} 2" id="participantName2" class="validate" type="text">
                        <span id="nameValidation2" class="helper-text nameValidation" data-error="Enter a valid name."  data-success="Correct, but this shouldn't be visible."></span>
                    </div>
                </td>
                <td>
                    <i id="participantRemoveButton2" class="material-icons" onclick="removeParticipant(2)">remove_circle_outline</i>
                </td>
                <td><input id="scoreField2" class="scoreColumn" autocomplete="off" type="text" value="" readonly="readonly"></td>
            </tr>
            <tr id="participant3">
                <td id="numberColumn3" class="numberColumn">3</td>
                <td>
                    <div class="input-field" style="white-space:nowrap;">
                        <input maxlength="16" required="required" placeholder="${playerPlaceHolder} 3" id="participantName3" class="validate" type="text">
                        <span id="nameValidation3" class="helper-text nameValidation" data-error="Enter a valid name."  data-success="Correct, but this shouldn't be visible."></span>
                    </div>
                </td>
                <td>
                    <i id="participantRemoveButton3" class="material-icons" onclick="removeParticipant(3)">remove_circle_outline</i>
                </td>
                <td><input id="scoreField3" class="scoreColumn" autocomplete="off" type="text" value="" readonly="readonly"></td>
            </tr>
            <tr id="participant4">
                <td id="numberColumn4" class="numberColumn">4</td>
                <td>
                    <div class="input-field" style="white-space:nowrap;">
                        <input maxlength="16" required="required" placeholder="${playerPlaceHolder} 4" id="participantName4" class="validate" type="text">
                        <span id="nameValidation4" class="helper-text nameValidation" data-error="Enter a valid name."  data-success="Correct, but this shouldn't be visible."></span>
                    </div>
                </td>
                <td>
                    <i id="participantRemoveButton4" class="material-icons" onclick="removeParticipant(4)">remove_circle_outline</i>
                </td>
                <td><input id="scoreField4" class="scoreColumn" autocomplete="off" type="text" value="" readonly="readonly"></td>
            </tr>
            <tr id="addParticipantButtonRow">
                <td></td>
                <td style="text-align: center; line-height: 80%;"><br />
                    <a class="btn-floating btn-small waves-effect waves-light black"><i class="material-icons" style="color: white;" onclick="addNextParticipant()">add</i></a>
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center">&nbsp;<br /><a id="createPoolButton" class="waves-effect waves-light btn-large green accent-5" onclick="createPool()"><b><fmt:message key="create.button"/></b></a></td>
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>
    <script type="text/javascript" src="js/materialize.js"></script>
    <script>
        // Initialize the dropdown menu without jQuery, yay!
        document.addEventListener('DOMContentLoaded', function() {
            M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
        });
    </script>
</body>
</html>
