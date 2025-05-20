import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,) {}

      //create user 
    async create(createUserDto: CreateUserDto){
    const newUser = new User();
    newUser.id = createUserDto.id;
    newUser.email= createUserDto.email;
    newUser.firstName = createUserDto.firstName;
    newUser.fullName = createUserDto.fullName;
    newUser.accountStatus = createUserDto.accountStatus;
    newUser.lastName = createUserDto.lastName;
    newUser.pageNo = createUserDto.pageNo;

    newUser.isApproved = false;
    newUser.dateJoined = new Date();

    const savedData = await this.usersRepository.save(newUser);
    return savedData;
    }


      //endpoint to get dashboard metrics
    async getDashMetrics(){
    const total = await this.usersRepository.count();
    const active = await this.usersRepository.count({ where: { isApproved: true } });
    const inactive = await this.usersRepository.count({ where: { isApproved: false } });

    return{
        total,
        active,
        inactive,
    };
    }

      //endpoint to fetch a paginated list of users
    async getUser(query: any){
        const page = parseInt(query.page) || 1;   //defining the parameters
        const limit = parseInt(query.limit) || 10;
        const skip = (page -1)* limit;

    const builder = this.usersRepository.createQueryBuilder('user');

    if (query.startDate && query.endDate){
        builder.andWhere('user.dateJoined BETWEEN :start AND :end', {
            start: query.startDate,
            end: query.endDate
        });
    }

    const [users, total] = await builder
        .orderBy('user.dateJoined', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

    const data = users.map((user)=> ({
        fullName: user.fullName,
        status: user.isApproved ? 'Active' : 'Inactive',
        registerDate: user.dateJoined,
    }))

      return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };


    }

      //endpoint to find a user by their ID
    async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      fullName: user.fullName,
      isApproved: user.isApproved,
      registeredDate: user.dateJoined.toISOString().split('T')[0],
    };

    }
      //endpoint to delete a user by their ID
    async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.remove(user);

    return { message: `User with ID ${id} has been deleted successfully.` };
  }

}
