document.addEventListener('DOMContentLoaded', () => {
    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;
        const img = document.getElementById('profile-pic-preview') as HTMLImageElement;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e: ProgressEvent<FileReader>) {
                if (e.target) {
                    img.src = e.target.result as string;
                    img.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const profilePicInput = document.getElementById('profile-pic') as HTMLInputElement;
    profilePicInput.addEventListener('change', handleFileSelect);

    const editButton = document.getElementById('edit-btn');
    if (editButton) {
        editButton.addEventListener('click', () => {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const element = input as HTMLInputElement | HTMLTextAreaElement;
                element.removeAttribute('readonly');
                element.style.backgroundColor = ''; // Optionally reset background color
            });

            const firstNameInput = document.getElementById('first-name') as HTMLInputElement;
            if (firstNameInput) {
                firstNameInput.focus();
            }
        });
    }

    const saveButton = document.getElementById('save-btn');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const data = gatherFormData();
            const uniqueId = getUniqueId(`${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`);
            localStorage.setItem(uniqueId, JSON.stringify(data));
            alert('Resume data saved locally.');
        });
    }

    const downloadButton = document.getElementById('download-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            const data = gatherFormData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    const printButton = document.getElementById('print-btn');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }

    const openTabButton = document.getElementById('open-tab-btn');
    if (openTabButton) {
        openTabButton.addEventListener('click', () => {
            const formData = gatherFormData();
            const newWindow = window.open('', '_blank');

            if (newWindow) {
                newWindow.document.write(`
                    <html>
                    <head>
                        <title>Resume</title>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #c9ebce; color: #000; }
                            .container { width: 80vw; padding: 5vw; background: #dffae3; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                            .header { text-align: left; margin-bottom: 20px; }
                            .profile img { width: 8vw; height: 11vw; }
                            .profile h1 { font-size: 28px; color: #333; margin: 10px 0 0; }
                            .section { margin-bottom: 20px; padding: 10px; border-radius: 5px; background: #f9f9f9; }
                            .section h2 { background-color: #a1c1a6; color: #fff; padding: 10px; border-radius: 5px; font-size: 20px; }
                            .section div { margin-bottom: 10px; }
                            .section label { display: block; font-weight: bold; }
                            .section p { margin: 8px 0; padding: 8px; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box; background: #fff; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <header class="header">
                                <div class="profile">
                                    <div class="profile-pic">
                                        ${formData.profilepic ? `<img src="${formData.profilepic}" alt="Profile Picture">` : '<p>No profile picture available</p>'}
                                    </div>
                                    <h1>${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}</h1>
                                </div>
                            </header>
                            <main class="main-content">
                                <div class="section">
                                    <h2>Personal Information</h2>
                                    <div><label>Email:</label><p>${formData.email}</p></div>
                                    <div><label>Date of Birth:</label><p>${formData.dob}</p></div>
                                    <div><label>Address:</label><p>${formData.address}</p></div>
                                    <div><label>Passport:</label><p>${formData.passport}</p></div>
                                    <div><label>Driving License:</label><p>${formData.drivingLicense}</p></div>
                                </div>
                                <div class="section"><h2>Skills</h2><p>${formData.skills}</p></div>
                                <div class="section"><h2>Experience</h2><p>${formData.experience}</p></div>
                                <div class="section"><h2>Education</h2><p>${formData.education}</p></div>
                            </main>
                        </div>
                    </body>
                    </html>
                `);
                newWindow.document.close();
            }
        });
    }

    const generateUrlButton = document.getElementById('generate-url-btn');
    if (generateUrlButton) {
        generateUrlButton.addEventListener('click', () => {
            const formData = gatherFormData();
            const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`;
            const uniqueId = getUniqueId(fullName);
            const uniqueUrl = `${window.location.origin}/resume/${uniqueId}`;

            // Store data in localStorage
            localStorage.setItem(uniqueId, JSON.stringify(formData));

            // Display the URL in the form
            const urlInput = document.getElementById('unique-url') as HTMLInputElement;
            if (urlInput) {
                urlInput.value = uniqueUrl;
            }

            alert('Unique URL generated. Share this link to view the resume.');
        });
    }

    function gatherFormData(): any {
        const profilePicInput = document.getElementById('profile-pic') as HTMLInputElement;
        const profilePicFile = profilePicInput.files && profilePicInput.files.length > 0
            ? URL.createObjectURL(profilePicInput.files[0])
            : '';

        return {
            profilepic: profilePicFile,
            firstName: (document.getElementById('first-name') as HTMLInputElement).value,
            middleName: (document.getElementById('middle-name') as HTMLInputElement).value,
            lastName: (document.getElementById('last-name') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            dob: (document.getElementById('dob') as HTMLInputElement).value,
            address: (document.getElementById('address') as HTMLInputElement).value,
            passport: (document.getElementById('passport') as HTMLInputElement).value,
            drivingLicense: (document.getElementById('driving-license') as HTMLInputElement).value,
            skills: (document.getElementById('skills') as HTMLTextAreaElement).value,
            experience: (document.getElementById('experience') as HTMLTextAreaElement).value,
            education: (document.getElementById('education') as HTMLTextAreaElement).value
        };
    }

    function getUniqueId(fullName: string): string {
        return fullName.toLowerCase().replace(/\s+/g, '-');
    }
});
