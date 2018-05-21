<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="pds" uri="/tlds/PoolDataStore" %>

<!-- Constant variables -->
<c:set var="internationalDomain" value="https://blindpool.com" scope="page"/>
<c:set var="dutchDomain" value="https://blindepoule.nu" scope="page"/>

<%-- If the language is Dutch, show dutch! --%>
<c:choose>
    <c:when test="${fn:endsWith(pageContext.request.serverName, 'blindepoule.nu')}">
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
<body>
<div id="createPool" align="center">
    <h1>
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
        <c:choose>
            <c:when test="${empty requestScope.poolData}">
                <tr>
                    <td colspan="2">
                        <p id="numberOfPlayersLabel">
                            <fmt:message key="number.of.players.label"/>&nbsp;
                            <input id="numberOfPlayers" type="number" value="5" min="5" max="50" maxlength="2">
                        </p>
                    </td>
                </tr>
            </c:when>
            <c:otherwise>
                <tr>
                    <td colspan="2">
                        <fmt:message key="share.url.header"/><br/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="white-space:nowrap;">
                        <input class="shareUrl" type="text" disabled
                               value="https://blindpool.com/?pool=${requestScope.poolData.key}">
                        <button>Copy</button>
                        <br/>&nbsp;
                    </td>
                </tr>
            </c:otherwise>
        </c:choose>
        <tr>
            <td><fmt:message key="entry.name"/></td>
            <td><fmt:message key="entry.score"/></td>
        </tr>
        <c:forEach var="current" items="${requestScope.poolData.participantsAndScores}">
            <tr id="1">
                <td><input class="nameInput" type="text" value="${current.participant.name}"></td>
                <td><input class="scoreInput" type="text" value="${current.score.homeClubScore}-${current.score.awayClubScore}" disabled></td>
            </tr>
        </c:forEach>
        <c:if test="${empty requestScope.poolData}">
            <tr>
                <td colspan="2">
                    <button id="createPoolButton" onclick="createPool()"><fmt:message key="create.button"/></button>
                </td>
            </tr>
        </c:if>
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
