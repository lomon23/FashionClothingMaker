async function loadHeader() {
    console.log('loadHeader function is called');

    try {
        const response = await fetch('../components/header.html'); // Path to your HTML file
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const headerHTML = await response.text();

        const body = document.querySelector('body');

        if (body) {
            console.log('Body element found!');
            body.insertAdjacentHTML('afterbegin', headerHTML);
            console.log('Header HTML inserted');
        } else {
            console.error('Body element not found!');
        }
    } catch (error) {
        console.error('Could not fetch or insert header HTML:', error);
    }
}

async function sideBar() {
    console.log('sideBar function is called');
    try{
        const response = await fetch('../components/sidebar.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sidebarHTML = await response.text();
        const body = document.querySelector('body');
        if (body) {
            console.log('Body element found!');
            body.insertAdjacentHTML('afterbegin', sidebarHTML);
            console.log('Sidebar HTML inserted');
        } else {
            console.error('Body element not found!');
        }
    } catch (error) {
        console.error('Could not fetch or insert sidebar HTML:', error);
    }
}