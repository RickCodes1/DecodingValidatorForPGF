#include <node_api.h>
#include "PGFimage.h"

#include <iostream>
#include <string>
#include <cstdint>
#include <cstring>
#include <vector>
#include <codecvt>
#include "base64.h"

/*
#include "PGFstream.h"
#include "BitStream.h"
#include "PGFtypes.h"
#include "Subband.h"
#include "WaveletTransform.h"
#include "PGFplatform.h"
#include "Decoder.h"
*/

class MyStream : public CPGFStream {
public:
    MyStream(unsigned char* buffer, int buffer_length) : m_buffer(buffer), m_buffer_length(buffer_length), m_position(0) {}
    virtual void Write(int* size, void* data) { /* implementation for writing to the stream */ }
    virtual void Read(int* size, void* data) { /* implementation for reading from the stream */ }
    virtual void SetPos(short mode, INT64 offset) { /* implementation for setting the stream position */ }
    virtual bool IsValid() const { /* implementation for checking the stream's validity */ }
    UINT64 GetPos() const {
        return m_position;
    }

private:
    unsigned char* m_buffer;
    int m_buffer_length;
    int m_position;
};

napi_value DecodePGF(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 1;
  napi_value argv[1];
  status = napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);
  if (status != napi_ok) {
    napi_throw_error(env, "EINVAL", "Failed to parse arguments");
  }

  // Get the binary string from the first argument
  char* buffer;
  size_t buffer_length;
  status = napi_get_buffer_info(env, argv[0], (void**)&buffer, &buffer_length);
  if (status != napi_ok) {
    napi_throw_error(env, "EINVAL", "Failed to get buffer from argument");
  }


  //Using the implemented abstract class:
  MyStream stream((unsigned char*) buffer, buffer_length);
  CPGFImage pgfImg;
  pgfImg.ConfigureDecoder(false);

  // Decode the PGF image
  pgfImg.Open(&stream);
  pgfImg.Read();
  
  std::vector<UINT8> buffer1(pgfImg.Width() * pgfImg.Height() * 4); // 4 bytes per pixel

  uint32_t x = 0x12345678;
  if (x == htonl(x)) {
      //std::cout << "Big endian" << std::endl;
      int map[] = {3, 2, 1, 0};
      //pgfImg.GetBitmap(img.bytesPerLine(), (UINT8*)img.bits(), img.depth(), map);
      pgfImg.GetBitmap(pgfImg.Width() * 4, buffer1.data(), 32, map);
  } else if (x == ntohl(x)) {
      //std::cout << "Little endian" << std::endl;
      int map[] = {0, 1, 2, 3};
      //pgfImg.GetBitmap(img.bytesPerLine(), (UINT8*)img.bits(), img.depth(), map);
      pgfImg.GetBitmap(pgfImg.Width() * 4, buffer1.data(), 32, map);
  } else {
      //std::cout << "Unknown endianness" << std::endl;
  }

  // Convert the decoded image to a base64 string
  std::wstring_convert<std::codecvt_utf8<char>, char> conv;
  std::string base64_str = conv.to_bytes(base64_encode(buffer1.data(), buffer1.size()));

  napi_value base64_js_str;
  status = napi_create_string_utf8(env, base64_str.c_str(), base64_str.length(), &base64_js_str);
  if (status != napi_ok) {
    napi_throw_error(env, "EINVAL", "Failed to create return value");
  }
  return base64_js_str;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value decode_fn;
  status = napi_create_function(env, nullptr, 0, DecodePGF, nullptr, &decode_fn);
  if (status != napi_ok) {
    napi_throw_error(env, "EINVAL", "Failed to create function");
  }
  status = napi_set_named_property(env, exports, "decodePGF", decode_fn);
  if (status != napi_ok) {
    napi_throw_error(env, "EINVAL", "Failed to set export");
  }
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)