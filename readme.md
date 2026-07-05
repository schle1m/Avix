# Avix Readme, Info, Docs and Others

## How to run Avix for yourself:
### - To run Avix for yourself on your own Bot youll need to have node.js Installed you can get it [Here](https://nodejs.org/).
### - Download the Sourcecode to your Machine, Unzip it and open the Folder.
### - Then youll need to install the Npm (Node package Manager) Packages from the package.json File you can do that by running `npm install` in the Project Folder. You should see Npm Installing the Packages wait till it finishes.
### - Then you will need to Create your Discord Bot. Head over to the [Developer Portal](https://discord.com/developers/applications) And Create a New Application. Once you have that Application go to the General Information Section and Copy the `Client Id` then Paste it into the `.env.example` File right behind the `ClientId=`.
### - After go to the `Bot` Tab and Turn on the `Message Content` and `Guild Members` Intent.
### - In the Same `Bot` Tab Copy your Token or Reset the Token to View it and Paste it behind the `Token=` in the `.env.example` File.
### - Rename the `.env.example` File to `.env`.
### - Open Command Line in the Folder and run `node index.js`.
### - If you did all Steps right the Bot should come online and the Console should show it is logged in.

## How to Customize the Bot:
### - To Edit the Embeds for almost all Functions of the Bot go to the `base.example.js` file and customize the EmbedBuilder then rename it to `base.js` and save.
