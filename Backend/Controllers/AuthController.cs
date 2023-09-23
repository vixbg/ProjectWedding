using System;
using Backend.Models;
using Backend.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : Controller
    {
        public static string Token { get; private set; } = null;

        public static bool Authorize(HttpRequest request)
        {
            var token = request.Headers.ContainsKey("Auth-Token") ? (string) request.Headers["Auth-Token"] : null;
            if (token != Token)
            {
                Console.WriteLine("ERROR: no token or token mismatch");
            }
            return Token != null && token == Token;
        }

        [HttpPost]
        public IActionResult Authenticate([FromBody] Authentication auth)
        {
            Console.WriteLine("Received login request");
            var truePass = "Drakula-9733".Md5().ToLower();
            if (auth.Username != "vixbg" || auth.Password.ToLower() != truePass)
            {
                Console.WriteLine("Authentication failed -> invalid user/password");
                return Unauthorized();
            }

            var rnd = new Random();
            Token = rnd.Next().ToString().Md5();
            Console.WriteLine("Login success: " + Token);
            return Ok(Token);
        }
    }
}