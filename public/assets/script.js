const DVR1 = "DVR1";
const DVR2 = "DVR2";
const DVR3 = "DVR3";

const hosts = {
  impressora: [
    "192.168.0.9",
    "192.168.0.12",
    "192.168.0.13",
    "192.168.7.249",
    "192.168.7.255",
    "192.168.8.19",
    "192.168.15.225",
    "192.168.7.243",
    "192.168.0.56",
    "192.168.7.239",
    "192.168.0.21",
    "192.168.0.55",
    "192.168.0.60",
  ],
  server: ["192.168.0.1", "192.168.0.2", "192.168.0.3", "192.168.0.7"],
  acessPoint: [
    "192.168.0.15",
    "192.168.0.16",
    "192.168.0.17",
    "192.168.0.18",
    "192.168.0.19",
  ],
  camera: [
    "192.168.1.177",
    "192.168.1.176",
    "192.168.1.175",
    "192.168.1.173",
    "192.168.1.172",
    "192.168.1.171",
    "192.168.1.2",
    "192.168.1.178",
    "192.168.1.179",
    "192.168.1.180",
    "192.168.1.181",
    "192.168.1.182",
    "192.168.1.183",
    "192.168.1.231",
    "192.168.1.185",
    "192.168.1.24",
    "192.168.1.162",
    "192.168.1.45",
    "192.168.1.216",
    "192.168.1.217",
    "192.168.1.218",
    "192.168.1.220",
    "192.168.1.223",
    "192.168.1.215",
    "192.168.1.227",
    "192.168.1.232",
    "192.168.1.228",
    "192.168.1.235",
    "192.168.1.236",
    "192.168.1.237",
    "192.168.1.200",
    "192.168.1.201",
    "192.168.1.202",
    "192.168.1.203",
    "192.168.1.204",
    "192.168.1.205",
    "192.168.1.206",
    "192.168.1.208",
    "192.168.1.209",
    "192.168.1.210",
    "192.168.1.211",
    "192.168.1.212",
    "192.168.1.213",
    "192.168.1.214",
  ],
  ramal: [
    "192.168.15.16",
    "192.168.8.10",
    "192.168.8.3",
    "192.168.15.223",
    "192.168.8.2",
    "192.168.2.10",
    "192.168.8.142",
    "192.168.15.19",
  ],
};

async function checkPing(selectedHosts) {
  const response = await fetch(`/ping?hosts=${selectedHosts.join(",")}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro desconhecido");
  }
  return response.json();
}

function displayPing(results) {
  const resultsDivImp = document.getElementById("results-imp");
  const resultsDivCam1 = document.getElementById("results-cam1");
  const resultsDivCam2 = document.getElementById("results-cam2");
  const resultsDivCam3 = document.getElementById("results-cam3");
  const resultsDivTel = document.getElementById("results-tel");
  const resultDivServer = document.getElementById("results-server");
  resultsDivImp.innerHTML = "";
  resultsDivCam1.innerHTML = "";
  resultsDivCam2.innerHTML = "";
  resultsDivCam3.innerHTML = "";
  resultsDivTel.innerHTML = "";
  resultDivServer.innerHTML = "";

  results.forEach((result) => {
    const card = document.createElement("div");
    card.className = "card";

    const deviceContainer = document.createElement("div");
    deviceContainer.className = "device-container";

    // Sinalizador de status
    const statusIndicator = document.createElement("img");
    statusIndicator.className = "status-indicator";
    statusIndicator.src =
      result.time !== "Inativo"
        ? `assets/img/${result.type}_online.png`
        : `assets/img/${result.type}_offline.png`; // Caminhos para as imagens

    const IpHostName = document.createElement("div");
    if (
      result.type === "impressora" ||
      result.type === "ramal" ||
      result.type === "server" ||
      result.type === "acessPoint"
    ) {
      IpHostName.textContent = HostIP(result.host);
      IpHostName.className = "HostName";
    } else {
      IpHostName.textContent = result.host;
      IpHostName.className = "HostName";
    }

    /*
                const containerDados = document.createElement('div');
                containerDados.className = 'container-dados';

                const resultTextHost = document.createElement('div');
                resultTextHost.innerHTML = `Host: <br> ${result.host}`;

                const resultTextIP = document.createElement('div');
                resultTextIP.innerHTML = `Ping: <Br> ${result.time || result.error}`;
                */

    deviceContainer.appendChild(statusIndicator);
    deviceContainer.appendChild(IpHostName);
    //containerDados.appendChild(resultTextHost);
    //containerDados.appendChild(resultTextIP);
    //deviceContainer.appendChild(containerDados);
    card.appendChild(deviceContainer);
    if (result.type === "impressora") {
      resultsDivImp.appendChild(card); // Adiciona cada card ao resultado Impressora
    } else if (result.type === "camera") {
      if (HostIP(result.host) === "DVR1") {
        resultsDivCam1.appendChild(card);
      } else if (HostIP(result.host) === "DVR2") {
        resultsDivCam2.appendChild(card);
      } else if (HostIP(result.host) === "DVR3") {
        resultsDivCam3.appendChild(card);
      }
    } else if (result.type === "ramal") {
      resultsDivTel.appendChild(card); // Adiciona cada card ao resultado Ramal
    } else if (result.type === "server" || result.type === "acessPoint") {
      resultDivServer.appendChild(card);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setInterval(async () => {
    const allHosts = [];
    for (const key in hosts) {
      allHosts.push(...hosts[key]); // Adiciona todos os hosts ao array
    }

    try {
      const results = await checkPing(allHosts); // Faz o ping em todos os hosts
      const detailedResults = results.map((result, index) => ({
        host: allHosts[index], // Associa o host ao resultado
        time: result.time,
        type: Object.keys(hosts).find((key) =>
          hosts[key].includes(allHosts[index])
        ), // Obtém o tipo de dispositivo
      }));
      displayPing(detailedResults);
    } catch (error) {
      displayPing([{ host: "Erro", time: error.message }]);
    }
  }, 10000); // A cada 10 segundos
});

function HostIP(ip) {
  const iphost = {
    "192.168.0.9": "RH BP W",
    "192.168.0.12": "RH BP R",
    "192.168.0.13": "RH COLOR R",
    "192.168.7.249": "Financeiro",
    "192.168.7.255": "Armazen",
    "192.168.8.19": "Torre1",
    "192.168.15.225": "Torre2",
    "192.168.7.243": "SAC",
    "192.168.0.56": "SAC 2",
    "192.168.0.60": "Marketing",
    "192.168.7.239": "Pendencia",
    "192.168.0.21": "Transferência",
    "192.168.0.55": "Recebimento",
    "192.168.0.21": "ZB Recebimento",
    "192.168.15.16": "RH 200",
    "192.168.8.10": "SAC 201",
    "192.168.8.3": "SAC 202",
    "192.168.15.223": "Financeiro 203",
    "192.168.8.2": "SAC 204",
    "192.168.2.10": "Comercial 205",
    "192.168.8.142": "Torre 207",
    "192.168.15.19": "Pendencia 208",
    "192.168.1.2": DVR1,
    "192.168.1.171": DVR1,
    "192.168.1.172": DVR1,
    "192.168.1.173": DVR1,
    "192.168.1.175": DVR1,
    "192.168.1.176": DVR1,
    "192.168.1.177": DVR1,
    "192.168.1.178": DVR1,
    "192.168.1.179": DVR1,
    "192.168.1.180": DVR1,
    "192.168.1.181": DVR1,
    "192.168.1.182": DVR1,
    "192.168.1.183": DVR1,
    "192.168.1.185": DVR1,
    "192.168.1.231": DVR1,
    "192.168.1.24": DVR2,
    "192.168.1.162": DVR2,
    "192.168.1.45": DVR2,
    "192.168.1.216": DVR2,
    "192.168.1.217": DVR2,
    "192.168.1.218": DVR2,
    "192.168.1.220": DVR2,
    "192.168.1.223": DVR2,
    "192.168.1.215": DVR2,
    "192.168.1.227": DVR2,
    "192.168.1.232": DVR2,
    "192.168.1.228": DVR2,
    "192.168.1.235": DVR2,
    "192.168.1.236": DVR2,
    "192.168.1.237": DVR2,
    "192.168.1.200": DVR3,
    "192.168.1.201": DVR3,
    "192.168.1.202": DVR3,
    "192.168.1.203": DVR3,
    "192.168.1.204": DVR3,
    "192.168.1.205": DVR3,
    "192.168.1.206": DVR3,
    "192.168.1.208": DVR3,
    "192.168.1.209": DVR3,
    "192.168.1.210": DVR3,
    "192.168.1.211": DVR3,
    "192.168.1.212": DVR3,
    "192.168.1.213": DVR3,
    "192.168.1.214": DVR3,
    "192.168.0.1": "DCHP",
    "192.168.0.2": "AD",
    "192.168.0.3": "GLPI",
    "192.168.0.7": "GTIR600",
    "192.168.0.15": "AP DIOGO",
    "192.168.0.16": "AP SAC",
    "192.168.0.17": "AP DIRETÓRIO",
    "192.168.0.18": "AP EXPEDIÇÃO",
    "192.168.0.19": "AP RECEBIMENTO",
  };
  return iphost[ip];
}
