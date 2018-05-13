<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="pds" uri="/tlds/PoolDataStore" %>

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
    <script>
        function createPool() {
            // TODO: Fill in the scores.
        }
    </script>
</head>
<body>
<div id="createPool" align="center">
    <h1><fmt:message key="create.pool.title"/></h1>
    <form>
        <table>
            <tr>
                <td><fmt:message key="entry.name"/></td>
                <td><fmt:message key="entry.score"/></td>
            </tr>
            <tr>
                <td><input class="nameInput" type="text"></td>
                <td><input class="scoreInput" type="text"></td>
            </tr>
            <tr>
                <td><input class="nameInput" type="text"></td>
                <td><input class="scoreInput" type="text"></td>
            </tr>
            <tr>
                <td><input class="nameInput" type="text"></td>
                <td><input class="scoreInput" type="text"></td>
            </tr>
            <tr>
                <td><input class="nameInput" type="text"></td>
                <td><input class="scoreInput" type="text"></td>
            </tr>
            <tr>
                <td colspan="2"><button onclick="createPool()"><fmt:message key="create.button"/></button></td>
            </tr>
        </table>
    </form>
    <br />
</div>
<div id="languageSettings" align="center">
    <form>
        <label><fmt:message key="language"/></label>
        <select onchange="this.options[this.selectedIndex].value && (window.location = this.options[this.selectedIndex].value);">
            <option value="https://blindpool.com" ${language == 'en' ? 'selected' : ''}>English</option>
            <option value="https://blindepoule.nu" ${language == 'nl' ? 'selected' : ''}>Nederlands</option>
        </select>
    </form>
    <p></pp>
    <p>
        <%-- Took me ages to figure out how to use parameters. --%>
        <fmt:message key="number.of.pools">
            <fmt:param value="${pds:getPoolCount()}"/>
        </fmt:message>
    </p>
</div>
</body>
</html>
