export function generateTable(usersList) {
    let rows = usersList.map(createRow);
    let table = `
  <table>
  `
        + rows.join('') +
        `
  </table>
  `;
    return table;
}
function createRow(user) {
    let str = `
    <tr>
      <td>` + user['screen_name'] + `</td>
    </tr>
  `;
    return str;
}
