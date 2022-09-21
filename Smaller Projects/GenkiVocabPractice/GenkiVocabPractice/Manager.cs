using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/*static Manager
 *  -string UserInput()
 *      Obtains and Validates UserInput
 *  -void Quiz()
 *      Calls Question a number of times, then prints out how the user did.
 *  -bool Question(VocabWord v)
 *      Asks for User Input, compares it with v, returns true if correct.
 */

namespace GenkiVocabPractice
{
    public static class Manager
    {
        public static Random rng = new Random();
        public static void Start() 
        {
            Console.WriteLine("こんいちは。\n" +
                "Welcome to the Genki Vocabulary Practicer!\n\n" +
                "This program was built to help with memorizing vocabulary\n" +
                "words from the Genki Japanese I textbook.\n");
        }

        public static string Options() 
        {
            Console.WriteLine("What would you like to do?\n" +
                "1 - Practice Quiz\n" +
                "2 - Import List\n" +
                "3 - Create List\n" +
                "4 - View List\n" +
                "5 - Quit");
            return PromptString("");
        }
        public static string PromptString(string q) 
        {
            string input;
            do
            {
                Console.Write(q + "\n--> ");
                input = Console.ReadLine().Trim().ToLower();
                if(input == null) 
                {
                    Console.WriteLine("Invalid input, please try again.");
                }
            }
            while (input == null);
            return input;
        }

        public static int PromptInt(string q) 
        {
            string input;
            int number;
            do 
            {
                Console.WriteLine(q + "\n--> ");
                input = Console.ReadLine().Trim().ToLower();
                if (input == null || !int.TryParse(input, out number))
                {
                    Console.WriteLine("Invalid input, please try again.");
                }
            }
            while(input == null || !int.TryParse(input, out number));
            return number;
        }

        public static VocabList FindList(List<VocabList> master, string topic) 
        {
            foreach(VocabList item in master) 
            {
                if (item.Topic == topic)
                    return item;
            }
            return null;
        }

        public static void Quiz(VocabList vocab) 
        {
            int numOfQs;
            int score = 0;
            VocabList quizList;
            do 
            {
                numOfQs = PromptInt(string.Format("How many words? (Max: {0} words)", vocab.Count));
                if (numOfQs <= 0 || numOfQs > vocab.Count) 
                {
                    Console.WriteLine("Invalid input, please try again.");
                }
            }
            while(numOfQs <= 0 || numOfQs > vocab.Count);
            quizList = vocab.Shuffle(rng);
            for(int i = 0; i < numOfQs; i++) 
            {
                //Call Question
                if (Question(quizList[i])) 
                {
                    //Raise Score given that its correct.
                    score++;
                }
            }

            // Print Results
            Console.WriteLine("".PadLeft(90,'*'));
            Console.WriteLine("Results: {0}/{1}, {2:P1}", score, numOfQs, score/numOfQs);
            Console.Write("Here is the List of Words!\n" + quizList);
            quizList.PrintList();
        }

        public static void ImportAll(List<VocabList> vocabulary) 
        {
            // Imports all currently known lists
            StreamReader reader = new StreamReader("../../../lists/allTopics.txt");
            string[] topics = reader.ReadLine().Split(',');
            reader.Close();

            foreach(string topic in topics)
            {
                VocabList newList = new VocabList();
                newList.ImportList(topic);
                vocabulary.Add(newList);
            }
        }

        public static bool Question(VocabWord word) 
        {
            string input;
            input = PromptString("\tType \'" + word.English + "\' in hiragana:");
            return input == word.Hiragana;
        }

        public static VocabList CreateList() 
        {
            VocabList vocab = new VocabList(PromptString("What would you like to name the list?"));
            string[] inputs = new string[3];
            do
            {
                Console.Write("Would you like to enter a word? (Type \"NO\" to exit.)\n-->");
                inputs[0] = Console.ReadLine().Trim();
                if (inputs[0] != "NO") 
                {
                    inputs[1] = PromptString("Enter a word in English.");
                    inputs[2] = PromptString("Enter the word in Hiragana.");
                    vocab.AddWord(new VocabWord(inputs[1], inputs[2]));
                }
            }
            while (inputs[0] != "NO");
            return vocab;
        }
    }
}
