<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="pds" uri="/tlds/PoolDataStore" %>

<!-- Constant variables -->
<c:set var="internationalDomain" value="https://blindpool.com" scope="page"/>
<c:set var="dutchDomain" value="https://blindepoule.nu" scope="page"/>
<c:set var="defaultNumberOfPlayers" value="5" scope="page"/>

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
<body onload="getPool()">
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
        <c:if test="${not empty requestScope.poolData}">
            <tr>
                <td colspan="3">
                    <fmt:message key="share.url.header"/><br/>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="white-space:nowrap;">
                    <input class="shareUrl" type="text" disabled
                           value="https://blindpool.com/?pool=${requestScope.poolData.key}">
                    <button>Copy</button>
                    <br/>&nbsp;
                </td>
            </tr>
        </c:if>
        <tr>
            <td colspan="2"><fmt:message key="entry.name"/></td>
            <td class="scoreColumn"><fmt:message key="entry.score"/></td>
        </tr>
        <c:choose>
            <c:when test="${empty requestScope.poolData}">
                <c:forEach begin="1" end="${defaultNumberOfPlayers}" varStatus="loop">
                    <tr id="participant${loop.index}">
                        <td><input id="participantName${loop.index}" class="nameInput" type="text" value=""></td>
                        <td><input class="scoreColumn" type="text" value="" disabled></td>
                        <%-- You cannot remove the owner --%>
                        <c:choose>
                            <c:when test="${loop.index eq 1}">
                                <td><fmt:message key="host"/></td>
                            </c:when>
                            <c:otherwise>
                                <td><button tabindex="-1" id="participantRemoveButton${loop.index}" onclick="removeParticipant(${loop.index})"><fmt:message key="remove.participant"/></button></td>
                            </c:otherwise>
                        </c:choose>
                    </tr>
                </c:forEach>
                <tr>
                    <td colspan="2"><button><fmt:message key="add.participant"/></button></td>
                </tr>
                <tr>
                    <td colspan="3" align="center">
                        <p><button id="createPoolButton" onclick="createPool()"><fmt:message key="create.button"/></button></p>
                    </td>
                </tr>
            </c:when>
            <c:otherwise>
                <c:forEach var="current" items="${requestScope.poolData.participantsAndScores}" varStatus="loop">
                    <tr id="participant${loop.index}">
                        <td colspan="2"><input class="nameInput" type="text" value="${current.participant.name}"></td>
                        <td><input class="scoreColumn" type="text" value="${current.score.homeClubScore}-${current.score.awayClubScore}" disabled></td>
                    </tr>
                </c:forEach>
                <tr>
                    <td colspan="3" align="center">
                        <p><button id="makeNewPoolButton"><fmt:message key="make.another.pool.button"/></button></p>
                    </td>
                </tr>
            </c:otherwise>
        </c:choose>
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
