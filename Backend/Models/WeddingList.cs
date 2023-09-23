using System.Collections.Generic;

namespace Backend.Models
{
    public class WeddingList
    {
        public List<WeddingGuest> Guests { get; set; }
        public int Count { get; set; }
        public int Viewed { get; set; }
        public int Attending1 { get; set; }
        public int Attending2 { get; set; }
        public int Attending3 { get; set; }
        public int Italian { get; set; }
        public int TotalAttending => Attending1 + Attending2 + Attending3;
    }
}