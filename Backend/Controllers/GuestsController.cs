using System;
using System.Data.Common;
using System.Linq;
using Backend.Models;
using Backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Backend.Controllers
{
    [Route("/api/guests")]
    public class GuestsController : ControllerBase
    {
        private readonly BackendDbContext context;

        public GuestsController(BackendDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            Console.WriteLine("Guest list requested");
            if (!AuthController.Authorize(Request)) return Unauthorized();
            Console.WriteLine("Sending full gust list");
            var list = context.Guests.Include(nameof(WeddingGuest.PlusOne)).Where(g => !g.IsPlusOne).OrderBy(g => g.Id).ToList();
            return Ok(new WeddingList
            {
                Guests = list,
                Count = list.Count + context.Guests.Count(g => g.IsPlusOne),
                Viewed = list.Count(g => g.ViewedOn != null),
                Attending1 = list.Count(g => g.Attending1) + list.Count(g => g.PlusOne != null && g.Attending1),
                Attending2 = list.Count(g => g.Attending2) + list.Count(g => g.PlusOne != null && g.Attending2),
                Attending3 = list.Count(g => g.Attending3) + list.Count(g => g.PlusOne != null && g.Attending3),
                Italian = list.Count(g => g.Italian) + list.Count(g => g.PlusOne != null && g.Italian)
            });
        }

        [HttpPost]
        public IActionResult Create([FromBody] WeddingGuest guest)
        {
            if (guest == null)
            {
                Console.WriteLine("ERROR: Received null as guest !!!!");
                return BadRequest("Cannot send empty object!");
            }
            Console.WriteLine("Create new guest requested");
            if (!AuthController.Authorize(Request)) return Unauthorized();
            Console.WriteLine("Saving guest to database");
            var rnd = new Random(DateTime.Now.Millisecond);
            guest.Attending1 = guest.Attending2 = guest.Attending3 = false;
            guest.ViewedOn = null;
            guest.IsPlusOne = false;
            if (guest.PlusOne != null)
            {
                guest.PlusOne.Attending1 = guest.Attending1;
                guest.PlusOne.Attending2 = guest.Attending2;
                guest.PlusOne.Attending3 = guest.Attending3;
                guest.PlusOne.ViewedOn = guest.ViewedOn;
                guest.PlusOne.Type = guest.Type;
                guest.PlusOne.Italian = guest.Italian;
                guest.PlusOne.IsPlusOne = true;
            }
            guest.SecretLink = rnd.Next(100000, 999999).ToString().Md5().ToLower();
            context.Guests.Add(guest);
            context.SaveChanges();

            return NoContent();
        }

        [HttpPut]
        public IActionResult Update([FromBody] WeddingGuest guest)
        {
            Console.WriteLine("Update guest requested");
            if (!AuthController.Authorize(Request)) return Unauthorized();
            var dbGuest = context.Guests.FirstOrDefault(g => g.Id == guest.Id);
            if (dbGuest == null)
            {
                Console.WriteLine($"Guest with ID: {guest.Id} was not found!");
                return NotFound();
            }
            Console.WriteLine("Saving guest changes to database");
            dbGuest.Names = guest.Names;
            dbGuest.Email = guest.Email;
            dbGuest.Type = guest.Type;
            dbGuest.Italian = guest.Italian;
            if (guest.PlusOne != null)
            {
                if (dbGuest.PlusOne == null)
                {
                    dbGuest.PlusOne = guest.PlusOne;
                }

                dbGuest.PlusOne.Attending1 = guest.Attending1;
                dbGuest.PlusOne.Attending2 = guest.Attending2;
                dbGuest.PlusOne.Attending3 = guest.Attending3;
                dbGuest.PlusOne.Italian = guest.Italian;
                dbGuest.PlusOne.ViewedOn = guest.ViewedOn;
                dbGuest.PlusOne.IsPlusOne = true;
            } else if (dbGuest.PlusOne != null)
            {
                var plusOne = dbGuest.PlusOne;
                dbGuest.PlusOne = null;
                context.Guests.Remove(plusOne);
            }

            context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            Console.WriteLine("Delete guest requested");
            if (!AuthController.Authorize(Request)) return Unauthorized();
            
            var dbGuest = context.Guests.FirstOrDefault(g => g.Id == id);
            if (dbGuest == null)
            {
                Console.WriteLine("Guest with ID: " + id + " was not found !");
                return NotFound();
            }
            Console.WriteLine($"Deleting guest {id}");
            context.Guests.Remove(dbGuest);
            context.SaveChanges();

            return NoContent();
        }
    }
}