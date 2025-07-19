// Все текстовые сообщения терминала
export interface TerminalMessages {
  bootMessages: string[];
  welcomeMessage: string[];
  helpText: string[];
  contactForm: string[];
  contactSuccess: string[];
  unknownCommand: string[];
  errorMessages: string[];
  loadingMessages: string[];
  themeHelp: string[];
  accessDenied: string[];
  pathNotFound: string[];
}

export const terminalData: TerminalMessages = {
  bootMessages: [
    'YUSHEERO INDUSTRIES UNIFIED OPERATING SYSTEM',
    'COPYRIGHT 2025-2077 YUSHEERO INDUSTRIES',
    'SERVER 666',
    '',
    'Initializing system...',
    'Loading data segments...',
    'Performing system diagnostics...',
    '* Memory test........... OK',
    '* CPU integrity......... OK',
    '* System storage........ OK',
    '* Network interface..... OK',
    '',
    'SYSTEM READY',
  ],
  welcomeMessage: [
    'TERMINAL READY FOR USE',
    'TYPE "HELP" FOR COMMAND LIST',
  ],
  helpText: [
    'AVAILABLE COMMANDS:',
    'HELP     - show command list',
    'CONTACT  - show contact information (VERIFICATION REQUIRED)',
    'THEME    - change terminal color scheme',
    'CLEAR    - clear terminal',
    'OFF      - shutdown terminal',
    ''
  ],
  contactForm: [
    '>>> CONTACT VERIFICATION',
    'INITIATING VOIGHT-KAMPFF TEST...',
    '',
    'Before providing contact information, please verify you are human.',
    ''
  ],
  contactSuccess: [
    '>>> HUMAN VERIFICATION SUCCESSFUL',
    'Thank you for confirming your human status.',
    '',
    '>>> CONTACT INFORMATION:',
    '',
    'Email: contact@yusheero.dev',
    'LinkedIn: linkedin.com/in/yusheero',
    'GitHub: github.com/yusheero',
    '',
    'I am currently available for freelance and contract work.',
    'Please allow 24-48 hours for a response.',
    ''
  ],
  unknownCommand: [
    '>>> ERROR: COMMAND NOT RECOGNIZED',
    'Type "HELP" for a list of available commands.',
    ''
  ],
  errorMessages: [
    '>>> ERROR: Invalid command format. Please try again.',
    '>>> ERROR: Permission denied. Access restricted.',
    '>>> ERROR: Command execution failed. System unstable.',
    '>>> ERROR: Bad input parameters. Check syntax.',
    '>>> ERROR: Resource not found. Verify path.'
  ],
  loadingMessages: [
    'Loading data...',
    'Accessing secure server...',
    'Establishing connection...',
    'Fetching information...',
    'Decrypting content...'
  ],
  themeHelp: [
    '>>> TERMINAL APPEARANCE:',
    '',
    'AVAILABLE THEMES:',
    '- GREEN  - Classic green phosphor (default)',
    '- AMBER  - Vintage amber phosphor',
    '- BLUE   - Cool blue digital',
    '',
    'COMMANDS:',
    '- THEME GREEN  - Switch to green theme',
    '- THEME AMBER  - Switch to amber theme',
    '- THEME BLUE   - Switch to blue theme',
    '- THEME        - Show this help text',
    ''
  ],
  accessDenied: [
    '>>> ACCESS DENIED',
    'Insufficient security clearance for requested operation.',
    'Contact system administrator for assistance.',
    ''
  ],
  pathNotFound: [
    '>>> ERROR: PATH NOT FOUND',
    'The specified directory or file does not exist.',
    'Use LS to view available sections.',
    ''
  ]
}; 