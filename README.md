# VSCode Extension Documentation: "Flutter l10m"

## Table of Contents

1. [Introduction](#1-introduction)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Using the Extension](#5-using-the-extension)
6. [Examples](#6-examples)
7. [Additional Resources](#7-additional-resources)
8. [Contributing](#8-contributing)
9. [License](#9-license)

---

## 1. Introduction

The **Flutter l10m** extension for Visual Studio Code automates the internationalization (i18n) process in Flutter projects that use the [l10m](https://pub.dev/packages/l10m) package. It monitors changes in `.arb` files and executes specific commands to regenerate translations, facilitating the development of multilingual applications.

---

## 2. Prerequisites

- **Visual Studio Code** installed.
- **Flutter SDK** configured and operational.
- A Flutter project set up to use the [l10m](https://pub.dev/packages/l10m) package.
- Basic knowledge of internationalization in Flutter.

---

## 3. Installation

**Installing the Extension:**

- Open Visual Studio Code.
- Go to the **Extensions** tab (or press `Ctrl+Shift+X`).
- Search for **"Flutter l10m"**.
- Click **Install** on the **Flutter l10m** extension.

---

## 4. Configuration

The **Flutter l10m** extension requires minimal configuration to work correctly. It uses a command that will be executed whenever a `.arb` file is changed.

### **Default Configuration**

By default, the extension executes the following command:

```bash
dart run l10m
```

### **Customizing the Command**

You can customize the command to be executed by modifying the `l10m.command` setting in the VSCode user or workspace settings.

#### **Steps to Configure:**

1. **Open Settings:**

   - Go to `File` > `Preferences` > `Settings` (or `Ctrl+,`).

2. **Search for "l10m":**

   - In the settings search bar, type `l10m`.

3. **Modify the Command:**

   - Find the **"Flutter l10m: Command"** setting.
   - Enter the desired command in the text field.

   **Example:**

   ```bash
   dart run l10m -m lib/custom_modules_folder
   ```

   - In this example, the command specifies a custom modules path.

### **Common Command Parameters:**

- **`-m` or `--module-path`:** Specifies the modules path. Example: `-m lib/modules`.
- **`--no-generate-root`:** Indicates not to generate translations in the root folder.
- **`-g` or `--generate`:** Specifies the name of the module to generate. Example: `-g user_profile`.

---

## 5. Using the Extension

After installation and configuration, the extension will work automatically.

### **How It Works:**

- **Monitoring `.arb` Files:** The extension monitors changes in all files with the `.arb` extension in the project.
- **Automatic Command Execution:** When a `.arb` file is modified, the extension executes the configured command, adapting it according to the changed file.

### **Specific Behaviors:**

- **`.arb` File in the Root Folder (`lib/l10n`):**

  - If the changed file is in `lib/l10n` and the `--no-generate-root` option is **not** present, the command will be executed with the `--generate-only-root` parameter.

  **Executed Command:**

  ```bash
  dart run l10m --generate-only-root
  ```

- **`.arb` File in a Module:**

  - If the changed file is in the modules path (by default, `lib/modules`), the extension extracts the module name and executes the command with `-g <module_name> --generate-only-module`.

  **Executed Command:**

  ```bash
  dart run l10m -g module_name --generate-only-module
  ```

- **Other Files:**

  - If the `.arb` file is not in any of the above paths, the extension executes the default configured command.

---

## 6. Examples

### **Example 1: Generating Translations for a Specific Module**

- **Scenario:**

  - You modified the file `lib/modules/user_profile/l10n/intl_en.arb`.

- **Extension Action:**

  - The extension detects the change and identifies the `user_profile` module.
  - Executes the command:

    ```bash
    dart run l10m -g user_profile --generate-only-module
    ```

### **Example 2: Generating Translations for the Root**

- **Scenario:**

  - You modified the file `lib/l10n/intl_en.arb`.

- **Extension Action:**

  - The extension recognizes that the file is in the root localization folder.
  - Executes the command:

    ```bash
    dart run l10m --generate-only-root
    ```

### **Example 3: Configuring a Custom Modules Path**

- **Configuration:**

  - In VSCode settings, you changed the command to:

    ```bash
    dart run l10m -m lib/custom_modules --no-generate-root
    ```

- **Scenario:**

  - You modified the file `lib/custom_modules/shopping_cart/l10n/intl_en.arb`.

- **Extension Action:**

  - The extension identifies the `shopping_cart` module in the custom path.
  - Executes the command:

    ```bash
    dart run l10m -g shopping_cart --generate-only-module
    ```

---

## 7. Additional Resources

- **l10m Package Documentation:**

  - To better understand how the `l10m` package works and its capabilities, refer to the official documentation:

    [https://pub.dev/packages/l10m](https://pub.dev/packages/l10m)

- **Reporting Issues and Suggestions:**

  - If you encounter problems or have suggestions to improve the extension, please open an issue in the project's repository (add the repository link here).

---

## 8. Contributing

Contributions are welcome! If you wish to contribute to the development of the extension:

1. **Fork the Repository:**

   - Clone the repository to your GitHub account.

2. **Create a Branch for Your Feature or Fix:**

   ```bash
   git checkout -b my-feature
   ```

3. **Make the Necessary Changes and Tests.**

4. **Submit a Pull Request:**

   - Describe the changes made and await review.

---

## 9. License

This extension is distributed under the MIT license. Refer to the `LICENSE` file in the repository for more information.

---

# Notes

- **Keeping the Extension Updated:**

  - Regularly check for updates to the extension in the VSCode Marketplace.

- **Compatibility:**

  - The extension has been tested on the latest versions of VSCode. If you encounter incompatibilities, please report them.

- **Support:**

  - For additional support, use the channels provided in the project's repository.

---

# Acknowledgments

Thank you for using the **Flutter l10m** extension! We hope it makes the internationalization process in your Flutter projects more efficient and enjoyable.

---
