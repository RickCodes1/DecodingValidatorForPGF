{
    "targets": [
        {
            "target_name": "AddonForPGF",
            "sources": [ "AddonForPGF.cc" ],
            "include_dirs": [ "..\\node_modules\\node-addon-api"
            ,".\\include\\libpgf"
            ,".\\include\\myLibPGF"
            ],
            "libraries": [ "C:\\Program Files (x86)\\Windows Kits\\10\\Lib\\10.0.19041.0\\um\\x64\\WS2_32.Lib"
            ,"{project_dir}\\include\\myLibPGF\\myLibPGF.lib"],
            "cflags": [ "-fno-exceptions" ],
            "arch": "ia32"
        }
    ]
}