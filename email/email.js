const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SG_API_KEY);
sgMail.setSubstitutionWrappers("-", "-");
const sendEmail = (receiverEmail, subject, text, html) => {
    let msg = {
        from: '"BIET hostel allotment" <hostel.allotment.biet@gmail.com>',
        to: receiverEmail,
        subject: subject,
    };
    if (text) msg.text = text;
    if (html) msg.html = html;
    sgMail.send(msg);
};

const sendUserDetails = (receiverEmail, userid, password, name) => {
    let msg = {
        from: '"BIET hostel allotment" <hostel.allotment.biet@gmail.com>',
        to: receiverEmail,
        subject: `Your Credentials`,
    };
    const html = `<div style = "padding: 0px, 10px;">
                        <p>hello ${name},</p>
                        <div>
                            <b>Userid: </b>${userid}
                        </div>
                        <div>
                            <b>password: </b>${password}
                        </div>
                        <br>
                        <footer style = 'opacity : 60%;text-align: justify-content;'>
                            If any one of your hostel didn't get this email. Inform them to contact to their hostel warden.
                        </footer>
                    </div>`;
    msg.html = html;
    sgMail.send(msg);
};

const sendBulk = async (personalizations) => {
    const msg = {};
    msg.personalizations = personalizations;
    msg.from = '"BIET hostel allotment" <hostel.allotment.biet@gmail.com>';
    msg.subject = `Your Credentials`;
    msg.html = `<div style = "padding: 0px, 10px;">
                    <p>hello -name-,</p>
                    <div>
                        <b>Userid: </b>-userid-
                    </div>
                    <div>
                        <b>password: </b>-password-
                    </div>
                    <br>
                    <footer style = 'opacity : 60%;text-align: justify-content;'>
                        If any one of your hostel didn't get this email. Inform them to contact to their hostel warden.
                    </footer>
                </div>`;
    sgMail.send(msg);
};

module.exports = { sendEmail, sendUserDetails, sendBulk };
