let data = [];

(async () => {
  await fetch("./data/miners.json")
    .then((rsp) => rsp.json())
    .then((rsp) => {
      data = rsp;
      render({ rows: data });
    });
})();

function getAsk({ email, subject }) {
  return `<a href="mailto:${email}?subject=${subject}">Ask</a>`;
}

function render({ rows }) {
  const tableRows = [];
  const askItem = ({ item }) =>
    getAsk({
      email: "weijingjaylin@gmail.com",
      subject: `looking for item ${item.company} ${item.model}`,
    });
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  rows
    .sort((a, b) => a.company.localeCompare(b.company))
    .sort((a, b) => a.model.localeCompare(b.model))
    .forEach((item) => {
      tableRows.push(`<tr>
            <td>${item.company || ""}</td>
            <td>${item.model || ""}</td>
            <td>${item.hashrate || ""}</td>
            <td class="d-none d-sm-block">${item.unit || askItem({ item })}</td>
            <td>${
              item.price ? formatter.format(item.price) : askItem({ item })
            }</td>
          </tr>`);
    });
  document.querySelector(".tbody").innerHTML = tableRows.join("");
}

document.querySelector("input").onkeypress = () => {
  const keywords = document.querySelector("input[name='keywords']").value;

  if (!keywords.length) {
    render({ rows: data });
    return;
  }

  let newData = data.filter(
    (item) =>
      item.company?.includes(keywords) ||
      item.company?.match(/keywords/i) ||
      item.model?.match(/keywords/i) ||
      item.hashrate?.match(/keywords/i) ||
      (item.unit && item.unit >= keywords) ||
      (item.price && item.price <= keywords)
  );
  render({ rows: newData });
};

document.querySelector(".btn.sent").onclick = () => {
  window.open(
    `mailto:weijingjaylin@gmail.com?subject=${
      document.querySelector(".subject").value
    }&body=${document.querySelector(".content").value}`
  );
};
