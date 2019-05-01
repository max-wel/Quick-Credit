const passwordRecovery = (user, token) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" rel="stylesheet">
    <style>
      * {font-family: 'Roboto Mono',monospace;}
      .container {width: 80%;margin: 0 auto;background: #fbfbfb;padding: 30px;color:#000}
      .username {font-size: 1rem;}
      .message{font-size: 1rem;line-height: 1.5;}
      .reset-btn {display: inline-block;background: #A200A7;padding: 10px; color: #fff !important;text-decoration: none;font-size: 1rem;}
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Quick-Credit</h2>
      <h3 class="username">Hello ${user.firstName},</h3>
      <p class="message">
      Someone(hopefully you), requested for a password reset for your Quick-Credit account. Kindly click on the button below to reset password.
      </p>
      <a class="reset-btn" href="">
        Reset password
      </a>
    </div>
  </body>
</html>`;

const notification = (user, status) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" rel="stylesheet">
    <style>
      * {font-family: 'Roboto Mono',monospace;}
      .container {width: 80%;margin: 0 auto;background: #fbfbfb;padding: 30px;color:#000}
      .username {font-size: 1rem;}
      .message{font-size: 1rem;line-height: 1.5;}
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Quick-Credit</h2>
      <h3 class="username">Hello ${user.firstName},</h3>
      <p class="message">
      Your loan request has been ${status}.
      </p>
    </div>
  </body>
</html>`;

export default { passwordRecovery, notification };
