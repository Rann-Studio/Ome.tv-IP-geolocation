// ==UserScript==
// @name         Ome.tv IP Geolocation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ome.tv IP Geolocation By RannStudio
// @author       RannStudio
// @match        https://ome.tv/
// @icon         https://www.google.com/s2/favicons?domain=ome.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var apiKey = "your-api-key"

    var regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

    var addMessage = async (msg) => {
        var putData = document.getElementsByClassName("message-bubble")[0].firstChild
        //var putData = document.getElementsByClassName("logbox")[0].firstChild
        var div = document.createElement("div");
        div.setAttribute("class","logitem")
        var p = document.createElement("p");
        p.setAttribute("class","statuslog");
        p.innerText = msg;
        div.appendChild(p);
        putData.appendChild(div);
    };

    window.oRTCPeerConnection =
        window.oRTCPeerConnection || window.RTCPeerConnection;

    window.RTCPeerConnection = function (...args) {
        const pc = new window.oRTCPeerConnection(...args);

        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = function (iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(" ");

            console.log(iceCandidate.candidate);
            const ip = fields[4];
            if (fields[7] === "srflx") {
                getLocation(ip);
            }
            return pc.oaddIceCandidate(iceCandidate, ...rest);
        };
        return pc;
    };

    var getLocation = async (ip) => {
        let url = `https://ipinfo.io/${ip}?token=${apiKey}`;
        await fetch(url).then((response) =>
                              response.json().then((json) => {
            const output = `
--------------------------
IP        : ${json.ip}
Country   : ${regionNames.of(json.country)}
State     : ${json.city}
City      : ${json.region}
Lat / Long: ${json.loc}
--------------------------
`;
            addMessage(output);
        })
                             );
    };
})();
