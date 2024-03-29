async function main() {
    try {
        const userId = getUserId();
        const userInfo = await getUserInfo(userId);
        const view = createView(userInfo);
        displayView(view);
    } catch (err) {
        console.error(`エラーが発生しました (${err})`);
    }
}

function getUserInfo(userId) {
    return fetch(`https://api.github.com/users/${userId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`${res.status}: ${res.statusText}`);
            } else {
                return res.json();
            }
        }).catch(err => {
            throw new Error("ネットワークエラー");
        });
}

function getUserId() {
    const value = document.getElementById("userId").value;
    return encodeURIComponent(value);
}

function createView(userInfo) {
    return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositories</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}

function displayView(view) {
    const result = document.getElementById("result");
    result.innerHTML = view;
}

function escapeSpecialChars(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHTML(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i - 1];
        if (typeof value === "string") {
            return result + escapeSpecialChars(value) + str;
        } else {
            return result + String(value) + str;
        }
    });
}