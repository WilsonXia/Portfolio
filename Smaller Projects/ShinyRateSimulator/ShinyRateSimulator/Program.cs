using System;
using System.Collections.Generic;

namespace ShinyRateSimulator
{
    class Program
    {
        static void Main(string[] args)
        {
            string input = "";
            Console.ForegroundColor = ConsoleColor.White;
            do
            {
                if (input.ToLower() != "no")
                {
                    //Obtain User Input
                    Console.Write("Enter the shiny rate: ");
                    int rate = int.Parse(Console.ReadLine());

                    Console.Write("Enter the amount of simulations: ");
                    int amount = int.Parse(Console.ReadLine());

                    do
                    {
                        if (input.ToLower() != "no")
                        {
                            //Perform Calculations
                            int[] runs = SimulateRuns(amount, rate);

                            //Print out Results
                            PrintRuns(runs, rate);
                            Summary(AnalyzeRuns(runs, rate));

                            //Prompt Again
                            Console.WriteLine("\nSimulate Again?  ");
                            input = Console.ReadLine();
                        }
                    }
                    while (input.ToLower() != "no");
                    //Prompt Again
                    Console.WriteLine("\nUse Different Numbers?  ");
                    input = Console.ReadLine();
                }
            }
            while (input.ToLower() != "no");

        }

        public static int ShinyEncounters(int rate)
        {
            //Returns the total number of attempts taken to return true for a given rate
            int i = 1;
            Random rng = new Random();
            while (rng.Next(0, rate) != 0)
            {
                i++;
            }
            return i;
        }

        public static int ShinyEncounters(double rate)
        {
            //Returns the total number of attempts taken to return true for a given rate
            int i = 1;
            Random rng = new Random();
            while (rng.NextDouble() > rate)
            {
                i++;
            }
            return i;
        }

        public static int[] SimulateRuns(int amount, int rate) 
        {
            int[] chances = new int[amount];
            for (int i = 0; i < chances.Length; i++)
            {
                chances[i] = ShinyEncounters(rate);
            }
            return chances;
        }

        public static int[] SortEncounters(int[] array) 
        {
            List<int> sorted = new List<int>();
            for(int i = 0; i < array.Length; i++) 
            {
                bool added = false;
                int data = array[i];
                for(int j = 0; j < sorted.Count; j++) 
                {
                    if (!added && data < sorted[j]) 
                    {
                        sorted.Add(data);
                        added = true;
                    }
                }
                if (!added) 
                {
                    sorted.Insert(0, data);
                }
            }
            int[] newArray = new int[array.Length];
            for(int i = 0; i < newArray.Length; i++) 
            {
                newArray[i] = sorted[i];
            }
            return newArray;
        }
        public static int[] AnalyzeRuns(int[] attempts, int rate)
        {
            int[] data = new int[3] {0, -1, int.MaxValue};//(average, highest, lowest)

            for (int j = 0; j < attempts.Length; j++)
            {
                Console.ResetColor();
                //Checks each trials to determine max/min
                int encounter = attempts[j];
                if (encounter > data[1])
                {
                    data[1] = encounter;
                }

                if (encounter < data[2])
                {
                    data[2] = encounter;
                }

                //Calculate the sum
                data[0] += encounter;
            }
            //Calculate Average
            data[0] /= attempts.Length;
            return data;
        }

        public static void PrintRuns(int[] attempts, int rate) 
        {
            int[] counter = new int[6];
            attempts = SortEncounters(attempts);
            Console.WriteLine("Attempts".PadRight(60, '-'));
            for (int i = 0; i < attempts.Length; i++) 
            {
                int encounter = attempts[i];
                //Decide Color base on ranges
                Console.ForegroundColor = ConsoleColor.White;
                if (encounter <= (int)(rate * 0.1))
                {
                    Console.BackgroundColor = ConsoleColor.Green;
                    counter[0]++;
                }
                else if (encounter <= (int)(rate * 0.2))
                {
                    Console.ForegroundColor = ConsoleColor.Green;
                    counter[1]++;
                }
                else if (encounter <= (int)(rate * 0.5))
                {
                    Console.ForegroundColor = ConsoleColor.White;
                    counter[2]++;
                }
                else if (encounter <= (int)(rate * 0.8))
                {
                    Console.ForegroundColor = ConsoleColor.Cyan;
                    counter[3]++;
                }
                else if (encounter <= (int)(rate * 1.2))
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    counter[4]++;
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    counter[5]++;
                }

                //Print out the encounter
                Console.Write(encounter.ToString().PadLeft(10));
                Console.BackgroundColor = ConsoleColor.Black;
                //Enter a line every nth character, n = 5
                if ((i + 1) % 5 == 0)
                    Console.WriteLine();
            }
            //Print out Counts
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("".PadRight(60, '-'));
            Console.WriteLine("Ranges:");
            for (int i = 0; i < counter.Length; i++)
            {
                string response;
                switch (i) 
                {
                    case 0:
                        response = "1% - 10% (Highlighted)";
                        break;
                    case 1:
                        response = "10% - 20% (Green)";
                        break;
                    case 2:
                        response = "20% - 50% (White)";
                        break;
                    case 3:
                        response = "50% - 80% (Cyan)";
                        break;
                    case 4:
                        response = "80% - 120% (Yellow)";
                        break;
                    default:
                        response = ">120% (Red)";
                        break;
                }
                Console.WriteLine(response.PadLeft(25) + ": " + counter[i]);
            }
            Console.WriteLine();
        }

        public static void Summary(int[] data) 
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(
                "\nAverage Encounters: {0}" +
                "\nHighest Encounter: {1}" +
                "\nLowest Encounter: {2}", 
                data[0],
                data[1],
                data[2]);
        }
    }
}
