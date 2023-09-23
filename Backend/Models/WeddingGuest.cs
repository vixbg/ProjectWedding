using System;

namespace Backend.Models
{
    public class WeddingGuest
    {
        public int Id { get; set; }
        public string Names { get; set; }
        public GuestType Type { get; set; }
        public string Email { get; set; }
        public DateTime? ViewedOn { get; set; }
        public bool Attending1 { get; set; }
        public bool Attending2 { get; set; }
        public bool Attending3 { get; set; }
        public bool Italian { get; set; }
        public string SecretLink { get; set; }
        public WeddingGuest PlusOne { get; set; }
        public bool IsPlusOne { get; set; }
    }
}