<%@ page pageEncoding="UTF-8" %>
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
    <link rel="stylesheet" type="text/css" href="css/layout.css">
    <script src="js/blindpool.js"></script>
</head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<body onload="loadPage()">
<div id="createPool" align="center">
    <h1 id="titleHeader">
        <c:choose>
            <c:when test="${empty requestScope.poolData}">
                <fmt:message key="create.pool.title"/>
            </c:when>
            <c:otherwise>
                <fmt:message key="owners.pool.title">
                    <fmt:param value="${requestScope.poolData.owner}" />
                </fmt:message>
            </c:otherwise>
        </c:choose>
    </h1>
    <table>
        <tr class="shareRow">
            <td colspan="3">
                <fmt:message key="share.url.header"/><br/>
            </td>
        </tr>
        <tr class="shareRow" style="white-space:nowrap;">
            <td colspan="3" >
                <input id="shareUrl" autocomplete="off" type="text" readonly="readonly"
                       value="https://blindpool.com/?pool=${requestScope.poolData.key}">
                <button onclick="copyUrlToClipboard()"><fmt:message key="copy.button"/></button>
                <br/>&nbsp;
            </td>
        </tr>
    </table>
    <table id="poolTable">
        <tr>
            <td><fmt:message key="entry.name"/></td>
            <td><label class="scoreColumn"><fmt:message key="entry.score"/></label></td>
            <td><!-- Using colspan in the other cells fucks this up, so I'll leave this empty cell --></td>
        </tr>
        <c:choose>
            <c:when test="${empty requestScope.poolData}">
                <c:forEach begin="1" end="${defaultNumberOfPlayers}" varStatus="loop">
                    <tr id="participant${loop.index}">
                        <td><input id="participantName${loop.index}" class="nameInput" autocomplete="off" type="text" value=""></td>
                        <td><input  id="scoreField${loop.index}" class="scoreColumn" autocomplete="off" type="text" value="" readonly="readonly"></td>
                        <%-- You cannot remove the owner --%>
                        <c:choose>
                            <c:when test="${loop.index eq 1}">
                                <td><label class="hostAndRemoveColumn"><fmt:message key="host"/></label></td>
                            </c:when>
                            <c:otherwise>
                                <td><button class="hostAndRemoveColumn" tabindex="-1" id="participantRemoveButton${loop.index}" onclick="removeParticipant(${loop.index})"><fmt:message key="remove.participant"/></button></td>
                            </c:otherwise>
                        </c:choose>
                    </tr>
                </c:forEach>
                <tr id="addParticipantButtonRow">
                    <td colspan="3"><button id="addParticipantButton" onclick="addNextParticipant()"><fmt:message key="add.participant"/></button></td>
                </tr>
            </c:when>
            <c:otherwise>
                <c:forEach var="current" items="${requestScope.poolData.participantsAndScores}" varStatus="loop">
                    <tr id="participant${loop.index}">
                        <td><input class="nameInput" autocomplete="off" type="text" value="${current.participant.name}"></td>
                        <td><input id="scoreField${loop.index}" class="scoreColumn" autocomplete="off" type="text" value="${current.score.homeClubScore}-${current.score.awayClubScore}" readonly="readonly"></td>
                        <td><!-- Using colspan in the other cells fucks this up, so I'll leave this empty cell --></td>
                    </tr>
                </c:forEach>
            </c:otherwise>
        </c:choose>
        <tr id="createPoolButtonRow">
            <td colspan="3" align="center">
                <p><button onclick="createPool()"><fmt:message key="create.button"/></button></p>
            </td>
        </tr>
        <tr id="makeNewPoolButtonRow">
            <td colspan="3" align="center">
                <p><button><fmt:message key="make.another.pool.button"/></button></p>
            </td>
        </tr>
    </table>
    &nbsp;
</div>
<div id="languageSettings" align="center">
    <form>
        <label><fmt:message key="language"/></label>
        <select onchange="this.options[this.selectedIndex].value && (window.location = this.options[this.selectedIndex].value);"> <!-- + '/?pool=' + getParameterByName('pool'));-->
            <option value="${internationalDomain}" ${language == 'en' ? 'selected' : ''}>English</option>
            <option value="${dutchDomain}" ${language == 'nl' ? 'selected' : ''}>Nederlands</option>
        </select>
    </form>
    <p>
        <%-- Took me ages to figure out how to use parameters. --%>
        <fmt:message key="number.of.pools">
            <fmt:param value="${pds:getPoolCount()}"/>
        </fmt:message>
    </p>
</div>
</body>
</html>
