document.addEventListener('DOMContentLoaded', function () {
    function handleFileSelect(event) {
        var input = event.target;
        var file = input.files ? input.files[0] : null;
        var img = document.getElementById('profile-pic-preview');
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (e.target) {
                    img.src = e.target.result;
                    img.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }
    var profilePicInput = document.getElementById('profile-pic');
    profilePicInput.addEventListener('change', handleFileSelect);
    var editButton = document.getElementById('edit-btn');
    if (editButton) {
        editButton.addEventListener('click', function () {
            var inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(function (input) {
                var element = input;
                element.removeAttribute('readonly');
                element.style.backgroundColor = ''; // Optionally reset background color
            });
            var firstNameInput = document.getElementById('first-name');
            if (firstNameInput) {
                firstNameInput.focus();
            }
        });
    }
    var saveButton = document.getElementById('save-btn');
    if (saveButton) {
        saveButton.addEventListener('click', function () {
            var data = gatherFormData();
            var uniqueId = getUniqueId("".concat(data.firstName, " ").concat(data.middleName ? data.middleName + ' ' : '').concat(data.lastName));
            localStorage.setItem(uniqueId, JSON.stringify(data));
            alert('Resume data saved locally.');
        });
    }
    var downloadButton = document.getElementById('download-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', function () {
            var data = gatherFormData();
            var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'resume.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
    var printButton = document.getElementById('print-btn');
    if (printButton) {
        printButton.addEventListener('click', function () {
            window.print();
        });
    }
    var openTabButton = document.getElementById('open-tab-btn');
    if (openTabButton) {
        openTabButton.addEventListener('click', function () {
            var formData = gatherFormData();
            var newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write("\n                    <html>\n                    <head>\n                        <title>Resume</title>\n                        <style>\n                            body { font-family: Arial, sans-serif; background-color: #c9ebce; color: #000; }\n                            .container { width: 80vw; padding: 5vw; background: #dffae3; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }\n                            .header { text-align: left; margin-bottom: 20px; }\n                            .profile img { width: 8vw; height: 11vw; }\n                            .profile h1 { font-size: 28px; color: #333; margin: 10px 0 0; }\n                            .section { margin-bottom: 20px; padding: 10px; border-radius: 5px; background: #f9f9f9; }\n                            .section h2 { background-color: #a1c1a6; color: #fff; padding: 10px; border-radius: 5px; font-size: 20px; }\n                            .section div { margin-bottom: 10px; }\n                            .section label { display: block; font-weight: bold; }\n                            .section p { margin: 8px 0; padding: 8px; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box; background: #fff; }\n                        </style>\n                    </head>\n                    <body>\n                        <div class=\"container\">\n                            <header class=\"header\">\n                                <div class=\"profile\">\n                                    <div class=\"profile-pic\">\n                                        ".concat(formData.profilepic ? "<img src=\"".concat(formData.profilepic, "\" alt=\"Profile Picture\">") : '<p>No profile picture available</p>', "\n                                    </div>\n                                    <h1>").concat(formData.firstName, " ").concat(formData.middleName ? formData.middleName + ' ' : '').concat(formData.lastName, "</h1>\n                                </div>\n                            </header>\n                            <main class=\"main-content\">\n                                <div class=\"section\">\n                                    <h2>Personal Information</h2>\n                                    <div><label>Email:</label><p>").concat(formData.email, "</p></div>\n                                    <div><label>Date of Birth:</label><p>").concat(formData.dob, "</p></div>\n                                    <div><label>Address:</label><p>").concat(formData.address, "</p></div>\n                                    <div><label>Passport:</label><p>").concat(formData.passport, "</p></div>\n                                    <div><label>Driving License:</label><p>").concat(formData.drivingLicense, "</p></div>\n                                </div>\n                                <div class=\"section\"><h2>Skills</h2><p>").concat(formData.skills, "</p></div>\n                                <div class=\"section\"><h2>Experience</h2><p>").concat(formData.experience, "</p></div>\n                                <div class=\"section\"><h2>Education</h2><p>").concat(formData.education, "</p></div>\n                            </main>\n                        </div>\n                    </body>\n                    </html>\n                "));
                newWindow.document.close();
            }
        });
    }
    var generateUrlButton = document.getElementById('generate-url-btn');
    if (generateUrlButton) {
        generateUrlButton.addEventListener('click', function () {
            var formData = gatherFormData();
            var fullName = "".concat(formData.firstName, " ").concat(formData.middleName ? formData.middleName + ' ' : '').concat(formData.lastName);
            var uniqueId = getUniqueId(fullName);
            var uniqueUrl = "".concat(window.location.origin, "/resume/").concat(uniqueId);
            // Store data in localStorage
            localStorage.setItem(uniqueId, JSON.stringify(formData));
            // Display the URL in the form
            var urlInput = document.getElementById('unique-url');
            if (urlInput) {
                urlInput.value = uniqueUrl;
            }
            alert('Unique URL generated. Share this link to view the resume.');
        });
    }
    function gatherFormData() {
        var profilePicInput = document.getElementById('profile-pic');
        var profilePicFile = profilePicInput.files && profilePicInput.files.length > 0
            ? URL.createObjectURL(profilePicInput.files[0])
            : '';
        return {
            profilepic: profilePicFile,
            firstName: document.getElementById('first-name').value,
            middleName: document.getElementById('middle-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            address: document.getElementById('address').value,
            passport: document.getElementById('passport').value,
            drivingLicense: document.getElementById('driving-license').value,
            skills: document.getElementById('skills').value,
            experience: document.getElementById('experience').value,
            education: document.getElementById('education').value
        };
    }
    function getUniqueId(fullName) {
        return fullName.toLowerCase().replace(/\s+/g, '-');
    }
});
