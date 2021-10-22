import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import {evaluate} from 'mathjs';
import './index.css';

const App = () => {
    const [theme, setTheme] = React.useState('dark');
    const themeVars = theme === 'dark' ? {
      app: { backgroundColor: '#000000' },
      terminal: { boxShadow: '0 2px 5px #111' },
      field: { backgroundColor: '#222333', color: '#FFFFFF', fontWeight: 'normal' },
      cursor: { animation: '1.02s blink-dark step-end infinite' } } :
    {
      app: { backgroundColor: '#ACA9BB' },
      terminal: { boxShadow: '0 2px 5px #33333375' },
      field: { backgroundColor: '#E3E3E3', color: '#474554', fontWeight: 'bold' },
      cursor: { animation: '1.02s blink-light step-end infinite' } };
  
  
    return /*#__PURE__*/React.createElement("div", { id: "app", style: themeVars.app }, /*#__PURE__*/
    React.createElement(Terminal, { theme: themeVars, setTheme: setTheme }));
  
  };
  const Terminal = ({ theme, setTheme }) => {
    const [title, setTitle] = React.useState('Ruchit Terminal');
    return /*#__PURE__*/React.createElement("div", { id: "terminal", style: { height: '100vh', width: '100vw', maxWidth: '100vw' } }, /*#__PURE__*/
    React.createElement("div", { id: "window", style: theme.window }, /*#__PURE__*/
    React.createElement("span", { id: "title", style: { color: "#FFFFFF" } }, title)), /*#__PURE__*/
  
    React.createElement(Field, { theme: theme, setTheme: setTheme, setTitle: setTitle }));
    
  };
  class Field extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        commandHistory: [],
        commandHistoryIndex: 0,
        fieldHistory: [{ text: 'Ruchit Terminal' }, { text: 'Type HELP to see the full list of commands.', hasBuffer: true }],
        userInput: '',
        isMobile: false };
  
      this.recognizedCommands = [{
        command: 'help',
        purpose: 'Provides help information for Ruchit Terminal commands.' },
      {
        command: 'date',
        purpose: 'Displays the current date.' },
      {
        command: 'start',
        purpose: 'Launches URL supplied in a new tab or separate window.',
        help: [
        'START <URL>',
        'Launches URL specified in a new tab or separate window.',
        '',
        'URL......................The website you want to open.'] },
  
      {
        command: 'cls',
        purpose: 'Clears the screen.' },
      {
        command: 'cmd',
        purpose: 'Starts a new instance of the Ruchit Terminal.' },
      {
        command: 'theme',
        purpose: 'Sets the color scheme of the Ruchit Terminal.',
        help: [
        'THEME [-l, -light, -d, -dark]',
        'Sets the color scheme of the Ruchit Terminal.',
        '',
        '-l, -light...............Sets the color scheme to light mode.',
        '-d, -dark................Sets the color scheme to dark mode.'] },
  
      {
        command: 'exit',
        purpose: 'Quits the Ruchit Terminal' },
      {
        command: 'time',
        purpose: 'Displays the current time.' },
      {
        command: 'about',
        isMain: true,
        purpose: 'Displays basic information about Ruchit.' },
      {
        command: 'experience',
        isMain: true,
        purpose: 'Displays information about Ruchit\'s experience.' },
      {
        command: 'skills',
        isMain: true,
        purpose: 'Displays information about Ruchit\'s skills as a developer.' },
      {
        command: 'contact',
        isMain: true,
        purpose: 'Displays contact information for Ruchit.' },
      {
        command: 'projects',
        isMain: true,
        purpose: 'Displays information about Ruchit\'s past projects as well current working projects along with github repo link in case you want to contribute' },
      {
        command: 'project',
        isMain: true,
        purpose: 'Launches a specified project in a new tab or separate window.',
        help: [
        'PROJECT <TITLE>',
        'Launches a specified project in a new tab or separate window.',
        'List of projects currently include:',
        'BillingNext Sys',
        'QuotationGen',
        'BlockChainJS',
        'BillingNext Core',
        '',
        'TITLE....................The title of the project you want to view.'] },
  
      {
        command: 'title',
        purpose: 'Sets the window title for the Ruchit Terminal.',
        help: [
        'TITLE <INPUT>',
        'Sets the window title for the Ruchit Terminal.',
        '',
        'INPUT....................The title you want to use for the Ruchit Terminal window.'] }];
  
  
      this.handleTyping = this.handleTyping.bind(this);
      this.handleInputEvaluation = this.handleInputEvaluation.bind(this);
      this.handleInputExecution = this.handleInputExecution.bind(this);
      this.handleContextMenuPaste = this.handleContextMenuPaste.bind(this);
    }
    componentDidMount() {
      if (typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1) {
        this.setState(state => ({
          isMobile: true,
          fieldHistory: [...state.fieldHistory, { isCommand: true }, {
            text: `Terminal Mode with keyboard input is not supported on mobile devices. Switch to desktop for keyboard input. Or use the links to navigate through the information`,
            isError: true,
            hasBuffer: true }] }));
  
  
      }
  
      document.querySelector('#field').focus();
    }

    componentDidUpdate() {
      const userElem = document.querySelector('#field');
      userElem.scrollTop = userElem.scrollHeight;
    }

    handleTyping(e) {
      e.preventDefault();
  
      const { key, ctrlKey, altKey } = e;
      const forbidden = [
      ...Array.from({ length: 12 }, (x, y) => `F${y + 1}`),
      'ContextMenu', 'Meta', 'NumLock', 'Shift', 'Control', 'Alt',
      'CapsLock', 'Tab', 'ScrollLock', 'Pause', 'Insert', 'Home',
      'PageUp', 'Delete', 'End', 'PageDown'];
  
  
      if (!forbidden.some(s => s === key) && !ctrlKey && !altKey) {
        if (key === 'Backspace') {
          this.setState(state => state.userInput = state.userInput.slice(0, -1));
        } else if (key === 'Escape') {
          this.setState({ userInput: '' });
        } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
          const { commandHistory, commandHistoryIndex } = this.state;
          const upperLimit = commandHistoryIndex >= commandHistory.length;
  
          if (!upperLimit) {
            this.setState(state => ({
              commandHistoryIndex: state.commandHistoryIndex += 1,
              userInput: state.commandHistory[state.commandHistoryIndex - 1] }));
  
          }
        } else if (key === 'ArrowDown' || key === 'ArrowRight') {
          const { commandHistory, commandHistoryIndex } = this.state;
          const lowerLimit = commandHistoryIndex === 0;
  
          if (!lowerLimit) {
            this.setState(state => ({
              commandHistoryIndex: state.commandHistoryIndex -= 1,
              userInput: state.commandHistory[state.commandHistoryIndex - 1] || '' }));
  
          }
        } else if (key === 'Enter') {
          const { userInput } = this.state;
  
          if (userInput.length) {
            this.setState(state => ({
              commandHistory: userInput === '' ? state.commandHistory : [userInput, ...state.commandHistory],
              commandHistoryIndex: 0,
              fieldHistory: [...state.fieldHistory, { text: userInput, isCommand: true }],
              userInput: '' }),
            () => this.handleInputEvaluation(userInput));
          } else {
            this.setState(state => ({
              fieldHistory: [...state.fieldHistory, { isCommand: true }] }));
  
          }
        } else {
          this.setState(state => ({
            commandHistoryIndex: 0,
            userInput: state.userInput += key }));
  
        }
      }
    }
    handleInputEvaluation(input) {
      try {
        const evaluatedForArithmetic = evaluate(input);
  
        if (!isNaN(evaluatedForArithmetic)) {
          return this.setState(state => ({ fieldHistory: [...state.fieldHistory, { text: evaluatedForArithmetic }] }));
        }
  
        throw Error;
      } catch (err) {
        const { recognizedCommands, giveError, handleInputExecution } = this;
        const cleanedInput = input.toLowerCase().trim();
        const dividedInput = cleanedInput.split(' ');
        const parsedCmd = dividedInput[0];
        const parsedParams = dividedInput.slice(1).filter(s => s[0] !== '-');
        const parsedFlags = dividedInput.slice(1).filter(s => s[0] === '-');
        const isError = !recognizedCommands.some(s => s.command === parsedCmd);
  
        if (isError) {
          return this.setState(state => ({ fieldHistory: [...state.fieldHistory, giveError('nr', input)] }));
        }
  
        return handleInputExecution(parsedCmd, parsedParams, parsedFlags);
      }
    }
    handleInputExecution(cmd, params = [], flags = []) {
      if (cmd === 'help') {
        if (params.length) {
          if (params.length > 1) {
            return this.setState(state => ({
              fieldHistory: [...state.fieldHistory, this.giveError('bp', { cmd: 'HELP', noAccepted: 1 })] }));
  
          }
  
          const cmdsWithHelp = this.recognizedCommands.filter(s => s.help);
  
          if (cmdsWithHelp.filter(s => s.command === params[0]).length) {
            return this.setState(state => ({
              fieldHistory: [...state.fieldHistory, {
                text: cmdsWithHelp.filter(s => s.command === params[0])[0].help,
                hasBuffer: true }] }));
  
  
          } else if (this.recognizedCommands.filter(s => s.command === params[0]).length) {
            return this.setState(state => ({
              fieldHistory: [...state.fieldHistory, {
                text: [
                `No additional help needed for ${this.recognizedCommands.filter(s => s.command === params[0])[0].command.toUpperCase()}`,
                this.recognizedCommands.filter(s => s.command === params[0])[0].purpose],
  
                hasBuffer: true }] }));
  
  
          }
  
          return this.setState(state => ({
            fieldHistory: [...state.fieldHistory, this.giveError('up', params[0].toUpperCase())] }));
  
        }
  
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, {
            text: [
            'Main commands:',
            ...this.recognizedCommands.
            sort((a, b) => a.command.localeCompare(b.command)).
            filter(({ isMain }) => isMain).
            map(({ command, purpose }) => `${command.toUpperCase()}${Array.from({ length: 15 - command.length }, x => '.').join('')}${purpose}`),
            '',
            'All commands:',
            ...this.recognizedCommands.
            sort((a, b) => a.command.localeCompare(b.command)).
            map(({ command, purpose }) => `${command.toUpperCase()}${Array.from({ length: 15 - command.length }, x => '.').join('')}${purpose}`),
            '',
            'For help about a specific command, type HELP <CMD>, e.g. HELP PROJECT.'],
  
            hasBuffer: true }] }));
  
  
      } else if (cmd === 'cls') {
        return this.setState({ fieldHistory: [] });
      } else if (cmd === 'start') {
        if (params.length === 1) {
          return this.setState(state => ({
            fieldHistory: [...state.fieldHistory, { text: `Launching ${params[0]}...`, hasBuffer: true }] }),
          () => window.open(/http/i.test(params[0]) ? params[0] : `https://${params[0]}`));
        }
  
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, this.giveError('bp', { cmd: 'START', noAccepted: 1 })] }));
  
      } else if (cmd === 'date') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, { text: `The current date is: ${new Date(Date.now()).toLocaleDateString()}`, hasBuffer: true }] }));
  
      } else if (cmd === 'cmd') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, { text: 'Launching new instance of the Ruchit Terminal...', hasBuffer: true }] }),
        () => window.open('https://ruchit.dev'));
      } else if (cmd === 'theme') {
        const { setTheme } = this.props;
  
        if (flags.length === 1 && ['-d', '-dark', '-l', '-light'].some(s => s === flags[0])) {
          const themeToSet = flags[0] === '-d' || flags[0] === '-dark' ? 'dark' : 'light';
  
          return this.setState(state => ({
            fieldHistory: [...state.fieldHistory, { text: `Set the theme to ${themeToSet.toUpperCase()} mode`, hasBuffer: true }] }),
          () => setTheme(themeToSet));
        }
  
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, this.giveError(!flags.length ? 'nf' : 'bf', 'THEME')] }));
  
      } else if (cmd === 'exit') {
        return window.close('','_parent','');
      } else if (cmd === 'time') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, { text: `The current time is: ${new Date(Date.now()).toLocaleTimeString()}`, hasBuffer: true }] }));
  
      } else if (cmd === 'about') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, {
            hasBuffer: true,
            isReactJSXForm: "about" }] }));
  
      } else if (cmd === 'experience') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, { text: [
            'Work:',
            'Allscripts India LLP',
            'Associate Software Engineer',
            'September 2020 - Present',
            '',
            'Mindpool Technologies - Deployed at Allscripts',
            'Software Developer – Intern',
            'November 2019 - September 2020',
            '',
            'TraxBee IoT Solutions',
            'Software Developer',
            'April 2019 - November 2019'],
            hasBuffer: true }] }));
  
      } else if (cmd === 'skills') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, { text: [
            'Languages:',
            'C#',
            'HTML',
            'CSS',
            'JavaScript',
            'Java',
            'Python',
            'SQL',
            '',
            'Libraries/Frameworks:',
            'dotNet Core',
            'React',
            'JQuery',
            'Entity Framework',
            'Identity Framework',
            'Bootstrap',
            'jQuery',
            '',
            'Other:',
            'Git',
            'GitHub',
            'Azure Devops',
            'Docker',
            'REST API',
            'ML .NET',
            'RabbitMQ',
            'Swagger',
            ''],
            hasBuffer: true }] }));
  
      } else if (cmd === 'contact') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, { text: [
            'Email: mail@ruchit.dev',
            'Website: https://ruchit.dev',
            'LinkedIn: ruchit-patel-a80888159',
            'GitHub: @ruchit-patel'],
            hasBuffer: true }] }));
  
      } else if (cmd === 'projects') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, { text: [
            'To view any of these projects live or their source files, type PROJECT <TITLE>, e.g. PROJECT BillingNext.',
            '',
            'BillingNextSys',
            'Built with DotNetCore, JQuery and lots of dedication',
            `BillingNext is a multi tenant scalable billing web application for generating GST invoices / non-GST challan and sharing them and also handling basic accounting tasks, CRM activities and much more.`,
            '',
            'QuotationGen',
            'Built with DotNetCore, JQuery and lots of love',
            'Quotation Gen is high performance dotnet Core Web Application to generate and share quotation on the go with pure JavaScript/HTML5 as frontend tech.',
            '',
            'NUVAdmissionSystem',
            'Built with DotNetCore and Javascripts',
            'NUV Admission System allows students to apply for admission at a University via a web app made with dotnet Core.',
            '',
            'BlockChainJS',
            'Built with Node',
            'Made a Proof of Concept in NodeJS for blockchain technology. It demonstrates how a genesis block origins and how to mine blocks.',
            '',
            'Nirvan3d',
            'Currently Building with BabylonJS',
            '3D Simulation Software for Furniture Industry'],
            hasBuffer: true }] }));
  
      } else if (cmd === 'project') {
        if (params.length === 1) {
          const projects = [{
            title: 'BillingNextSys',
            live: 'https://billingnextsys.azurewebsites.net' },
          {
            title: 'QuotationGen',
            live: 'https://github.com/BillingNext/QuotationGen' },
          {
            title: 'NUVAdmissionSystem',
            live: 'https://github.com/Amorpheuz/AdmissionSysMain' },
          {
            title: 'BlockChainJS',
            live: 'https://github.com/ruchit-patel/BlockChainJS' },
          {
            title: 'Nirvan3d',
            live: 'https://github.com/ruchit-patel/Nirvan3d' }];
  
  
            return this.setState(state => ({
              fieldHistory: [...state.fieldHistory, { text: `Launching ${params[0]}...`, hasBuffer: true }] }),
              () => window.open(projects.filter(s => s.title === params[0])[0].live));
        }
  
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, this.giveError('bp', { cmd: 'PROJECT', noAccepted: 1 })] }));
  
      } else if (cmd === 'title') {
        return this.setState(state => ({
          fieldHistory: [...state.fieldHistory, {
            text: `Set the React Terminal title to ${params.length > 0 ? params.join(' ') : '<BLANK>'}`,
            hasBuffer: true }] }),
  
        () => this.props.setTitle(params.length > 0 ? params.join(' ') : ''));
      }
    }
    handleContextMenuPaste(e) {
      e.preventDefault();
  
      if ('clipboard' in navigator) {
        navigator.clipboard.readText().then(clipboard => this.setState(state => ({
          userInput: `${state.userInput}${clipboard}` })));
  
      }
    }
    giveError(type, extra) {
      const err = { text: '', isError: true, hasBuffer: true };
  
      if (type === 'nr') {
        err.text = `${extra} : The term or expression '${extra}' is not recognized. Check the spelling and try again. If you don't know what commands are recognized, type HELP.`;
      } else if (type === 'nf') {
        err.text = `The ${extra} command requires the use of flags. If you don't know what flags can be used, type HELP ${extra}.`;
      } else if (type === 'bf') {
        err.text = `The flags you provided for ${extra} are not valid. If you don't know what flags can be used, type HELP ${extra}.`;
      } else if (type === 'bp') {
        err.text = `The ${extra.cmd} command requires ${extra.noAccepted} parameter(s). If you don't know what parameters to use, type HELP ${extra.cmd}.`;
      } else if (type === 'up') {
        err.text = `The command ${extra} is not supported by the HELP utility.`;
      }
  
      return err;
    }
  
    render() {
      const { theme } = this.props;
      const { fieldHistory, userInput } = this.state;
  
      return /*#__PURE__*/React.createElement("div", {
        id: "field",
        className: theme.app.backgroundColor === '#333444' ? 'dark' : 'light',
        style: theme.field,
        onKeyDown: e => this.handleTyping(e),
        tabIndex: 0,
        onContextMenu: e => this.handleContextMenuPaste(e) },
  
      fieldHistory.map(({ text, isCommand, isError, hasBuffer, isReactJSXForm }) => {
        if(isReactJSXForm)
        {
           return /*#__PURE__*/(
            React.createElement(MultiTextWithImage, { input: text, isError: isError, hasBuffer: hasBuffer, elementType: isReactJSXForm}));
          //return React.createElement(this.About());
        }
        if (Array.isArray(text)) {
          return /*#__PURE__*/React.createElement(MultiText, { input: text, isError: isError, hasBuffer: hasBuffer });
        }
  
        return /*#__PURE__*/React.createElement(Text, { input: text, isCommand: isCommand, isError: isError, hasBuffer: hasBuffer });
      }), /*#__PURE__*/
      React.createElement(UserText, { input: userInput, theme: theme.cursor }));
  
    }}
  
  const Text = ({ input, isCommand, isError, hasBuffer }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/
  React.createElement("div", null,
  isCommand && /*#__PURE__*/React.createElement("div", { id: "query" }, "RT C:\\Users\\Guest>"), /*#__PURE__*/
  React.createElement("span", { className: !isCommand && isError ? 'error' : '' }, input)),
  
  hasBuffer && /*#__PURE__*/React.createElement("div", null));
  
  const MultiText = ({ input, isError, hasBuffer }) => /*#__PURE__*/React.createElement(React.Fragment, null,
  input.map(s => /*#__PURE__*/React.createElement(Text, { input: s, isError: isError })),
  hasBuffer && /*#__PURE__*/React.createElement("div", null));
  
//   const MultiTextWithImage = ({ input, isError, hasBuffer }) => /*#__PURE__*/React.createElement(React.Fragment, null,
//     input.map(s => /*#__PURE__*/React.createElement(Text, { input: s, isError: isError })),
//     hasBuffer && /*#__PURE__*/React.createElement("div", null), React.createElement("img", {
//       src: input.at(-1),
//       alt: "image"
//       // any other image attributes you need go here
//     }, null));
  
const MultiTextWithImage = ({ input, isError, hasBuffer, elementType }) => /*#__PURE__*/React.createElement(MultiMediaRenderer,{elementType: elementType},
    hasBuffer && /*#__PURE__*/React.createElement("div", null));

  const UserText = ({ input, theme }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/
  React.createElement("div", { id: "query" }, "RT C:\\Users\\Guest>"), /*#__PURE__*/
  React.createElement("span", null, input), /*#__PURE__*/
  React.createElement("div", { id: "cursor", style: theme }));
  
  
  ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector('#root'));
  
  class MultiMediaRenderer extends React.Component {
    render()
    {
        if(this.props.elementType=="about")
        {
            return (
            <div>
                <h1>Hey there! I'm Ruchit</h1>
                <h2>A software engineer from Vadodara, India with expertise in dotnet Core web applications.</h2>
                <h2> I am a tech enthusiast and a curious learner for life. As a full time software engineer i work with Allscripts India, and currently ready to work with you on any freelance projects.</h2>
                <img src="./resources/pp.jfif" alt="My Photo" /><br/>
                <a href="./resources/RuchitResume.pdf" target="_blank">Have a look at my resume here!</a>
            </div>);
        }
        else if(this.props.elementType=="experience")
        {
            return (
            <div>
                <h1>Hey there! I'm Ruchit</h1>
                <h2>A software engineer from Vadodara, India with expertise in dotnet Core web applications.</h2>
                <h2> I am a tech enthusiast and a curious learner for life. As a full time software engineer i work with Allscripts India, and currently ready to work with you on any freelance projects.</h2>
                <img src="./resources/pp.jfif" alt="My Photo" /><br/>
                <a href="./resources/RuchitResume.pdf" target="_blank">Have a look at my resume here!</a>
            </div>);
        }
    }
  }
  