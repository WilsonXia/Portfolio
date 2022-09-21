using GenkiVocabPractice;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using static System.Net.Mime.MediaTypeNames;

class Program 
{
    public static void Main(string[] args)
    {
        // Fields
        List<VocabList> masterList = new List<VocabList>();
        VocabList currentList = new VocabList();
        string input;
        bool notExited = true;

        // Start of Code
        Manager.Start();
        input = Manager.Options();

        while (notExited) 
        {
            switch (input)
            {
                case "1":
                case "practice quiz":
                    // Checks the number of topics in the MasterList.
                    if(masterList.Count > 1) 
                    {
                        while(currentList.isEmpty()) 
                        {
                            input = Manager.PromptString("Which list would you like to use?");
                            currentList = Manager.FindList(masterList, input);
                            if(currentList == null) 
                            {
                                Console.WriteLine("List not found. Try again.");
                            }
                        }
                    }
                    // No Lists in MasterList.
                    else if(masterList.Count == 0) 
                    {
                        Console.WriteLine("You currently don't have a Vocabulary List created...");
                        break;
                    }
                    // 1 List Only.
                    else 
                    {
                        currentList = masterList[0];
                    }
                    // Call the Quiz method in the manager class.
                    Manager.Quiz(currentList);
                    break;
                case "2":
                case "import list":
                    /* Prompt for what list to import
                    input = Manager.PromptString("Which topic would you like to import?");
                    VocabList newList = new VocabList();
                    newList.ImportList(input);
                    masterList.Add(newList);
                    */
                    Manager.ImportAll(masterList);
                    break;
                case "3":
                case "create list":
                    masterList.Add(Manager.CreateList());
                    break;
                case "4":
                case "view list":
                    Console.WriteLine("Currently known topics: ");
                    foreach(VocabList v in masterList) 
                    {
                        Console.WriteLine("{0}\n",v);
                        v.PrintList();
                    }
                    break;
                case "5":
                case "quit":
                    notExited = false;
                    break;
                default:
                    Console.WriteLine();
                    break;
            }
            if (notExited) 
            {
                input = Manager.Options();
            }
        }
        // Exit Statement
        Console.WriteLine("Good bye! またね！");
    }
}
/* Plan Details:
 * Quiz the user on Vocabulary by:
 * -Giving the user and English word and requiring a direct translation
 * -Giving a word in Japanese and having the user translate it to english
 * 
 * Vocabulary words might have to be imported via a txt doc for optimization.
 * Will organize the vocabulary through a series of arrays based on category
 * Then will have Lists of Vocab for each lesson
 * Finally, a compilation of the chapters.
 * 
 * User should be able to choose which words to study, either based on category
 * or chapters.
 * 
 * Potential Classes:
 *  VocabWord
 *  -string english
 *  +string Eng
 *      Holds the english word
 *  -string hiragana
 *  +string Hiragana
 *      Holds the word in hiragana
 *  -ToString()
 *      returns (Eng, Hiragana)
 *  
 *  VocabList
 *  -string topic
 *      Name of the List
 *  -List vocabulary
 *      List that holds the Vocab
 *  -List<VocabWord> Shuffle(Random rng)
 *      Shuffles the list so it can be used for quizing
 *  -void ImportList()
 *      Sets up the list of Vocab
 *  -void PrintList()
 *      Calls each VocabWord's ToString neatly.
 *  
 *  static Manager
 *  -string UserInput()
 *      Obtains and Validates UserInput
 *  -void Quiz()
 *      Calls Question a number of times, then prints out how the user did.
 *  -bool Question(VocabWord v)
 *      Asks for User Input, compares it with v, returns true if correct.
 */