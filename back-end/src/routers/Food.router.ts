import { sample_foods, sample_tags } from "../data";
import { Router } from "express";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";
import { UserModel } from "../models/user.model";
const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const foodscount = await FoodModel.countDocuments()
    if(foodscount>0){
        res.send('Seed Is Already Done!')
        return;
    }
    FoodModel.create(sample_foods);
    res.send("Seed Is Done");
  })
);

router.get("/", asyncHandler(
  async(req, res) => {
    // instead of sending sample_foods from data ts we send it from our db
    const foods = await FoodModel.find();
    res.send(foods);
  }
));

router.get("/tags", asyncHandler(
  async (req, res) => {
  const tags = await  FoodModel.aggregate([
    {
      $unwind:'$tags'
    },
    {
      $group:{
        _id: '$tags',
        count:{$sum:1}
      }

    },
    {
      $project:{
        _id:0,
        name:'$_id',
        count: '$count'
      }
    }
  ]).sort({count: -1});
  const all = {
    name:'All',
    count: await FoodModel.countDocuments()
  }

  tags.unshift(all)
  res.send(tags);
}));

router.get("/tag/:tag", asyncHandler( async (req, res) => {
  const tag = await FoodModel.find({tags:req.params.tag})
  res.send(tag);
}));

router.get("/:foodId", asyncHandler( 
  async (req, res) => {
  const food = await FoodModel.findById(req.params.foodId)
  res.send(food);
}));

router.get("/search/:searchterm", asyncHandler(
  async(req, res) => {
    const searchRegx = new RegExp(req.params.searchterm, 'i')
    const food =await FoodModel.find({name:{$regex:searchRegx}
    })
    res.send(food);
  }
));

export default router;
