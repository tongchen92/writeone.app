export function getCookieByName(name: string) {
  if (typeof document === "undefined") {
    // document is not defined, return null
    return null;
  }
  const cookies = document.cookie;
  // Split the list of cookies into individual cookie strings
  var cookieList = cookies.split(";");

  // Loop through each cookie and check if the name matches
  for (var i = 0; i < cookieList.length; i++) {
    var cookie = cookieList[i].trim();
    if (cookie.startsWith(name + "=")) {
      // If the name matches, return the value of the cookie
      return cookie.substring(name.length + 1);
    }
  }

  // If the cookie is not found, return null
  return null;
}

export const setCookie = (
  name: string,
  value: string,
  expirationTimestampMil?: number
) => {
  const expirationTime =
    expirationTimestampMil || Date.now() + 30 * 24 * 60 * 60 * 1000;
  const date = new Date();
  date.setTime(expirationTime); // Convert expiration time to milliseconds
  const expires = "; expires=" + date.toUTCString();
  document.cookie = `${name}=${value}${expires}; path=/`;
};
