Decoding Validator For PGF
--------------------------------------------------------------------------------------------

this is a NodeJS electron app that could be run with `npm run start`

You may want to:
- run it with all the NodeJS add-ons that it calls by first building them without errors with the `node-gyp configure build` command for each addon after changing to its directory.

- run it with just some add-ons by commenting some of them to make some tests.

- invert the comments to test the prepared ideal cases when a comparison result is TRUE or FALSE

# Ideal Test Case

To run the app with a succesful TRUE result, as if it worked 100% as expected, BUILD the add-ons you want, COMMENT the add-ons you don't want for now, UNCOMMENT the line `dataToSend["conv_img"] = og_base64Buffer;`

![TRUE case](https://imgur.com/a/T0lKpk4)

# Facing the challenge

To be able to see the app problems, leave it as it was and try to BUILD the UtilsFromPGF add-on

# Facts to consider:

On `binding.gyp`, when not given an absolute path in "libraries", this error might appear: `LINK : fatal error LNK1181: cannot open input file 'myLibPGF.lib' `.

So, you should replace`"{project_dir}\\include\\myLibPGF\\myLibPGF.lib"` with an absolute path of your system.
BTW, I am doubting about 2 of these 3 paths there:
```
            ,".\\include\\libpgf"
            ,".\\include\\myLibPGF"
            ,"{project_dir}\\include\\myLibPGF\\myLibPGF.lib"],
```
I am also doubting about that .lib file that I gerenrated solely from the .cpp and .h files just in x86 arch because due to the INT, BYTE types, it gave errors in x64. Thats is the only reason I tried also including there `"arch": "ia32"` and also tried to build the addon from the "x86 Native Tools Command Prompt for VS 2019" but none of that worked...

After that, in most of the combinations of commenting some of the 3 lines I say i doubt of, you may see these specific errors:
```
  AddonForPGF.cc
  win_delay_load_hook.cc
     Creating library 
\UtilsFromPGF\build\Release\AddonForPGF.lib and object 
\UtilsFromPGF\build\Release\AddonForPGF.exp

AddonForPGF.obj : error LNK2001: unresolved external symbol "public: void __cdecl CPGFImage::GetBitmap(int,unsigned char *,unsigned char,int * const,bool (__cdecl*)(double,bool,void *),void *)con
st " (?GetBitmap@CPGFImage@@QEBAXHPEAEEQEAHP6A_NN_NPEAX@Z3@Z)
AddonForPGF.obj : error LNK2001: unresolved external symbol "public: void __cdecl CPGFImage::Read(int,bool (__cdecl*)(double,bool,void *),void *)" (?Read@CPGFImage@@QEAAXHP6A_NN_NPEAX@Z1@Z) 
AddonForPGF.obj : error LNK2001: unresolved external symbol "public: void __cdecl CPGFImage::Open(class CPGFStream *)" (?Open@CPGFImage@@QEAAXPEAVCPGFStream@@@Z) 
AddonForPGF.obj : error LNK2001: unresolved external symbol "public: virtual __cdecl CPGFImage::~CPGFImage(void)" (??1CPGFImage@@UEAA@XZ)
AddonForPGF.obj : error LNK2001: unresolved external symbol "public: __cdecl CPGFImage::CPGFImage(void)" (??0CPGFImage@@QEAA@XZ)
AddonForPGF.obj : error LNK2001: unresolved external symbol "class std::basic_string<char,struct std::char_traits<char>,class std::allocator<char> > __cdecl base64_encode(unsigned char const *,un 
signed __int64,bool)" (?base64_encode@@YA?AV?$basic_string@DU?$char_traits@D@std@@V?$allocator@D@2@@std@@PEBE_K_N@Z)
UtilsFromPGF\build\Release\AddonForPGF.node : fatal error LNK1120: 6 unresolved externals 
```

And that is the challenge to solve or fix...


P.S: Plase excuse me and tell me if right now I am missing some license files of any kind. Thanks.